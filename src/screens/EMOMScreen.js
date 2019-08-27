import React, { Component } from 'react'
import { Keyboard, ScrollView, Text, StyleSheet, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import Select from '../components/Select'
import Title from '../components/Title'
import Time from '../components/Time'
import ProgressBar from '../components/ProgressBar'
import BackgroundProgress from '../components/BackgroundProgress'
import Sound from 'react-native-sound'
import KeepAwake from 'react-native-keep-awake'

const alert = require('../../assets/sounds/alert.wav')

class EMOMScreen extends Component {

    state = {
        keyboardIsVisible: false,

        alerts: [0],
        countdown: 0,
        time: '1',

        paused: false,
        isRunning: false,
        countdownValue: 0,
        count: 0
    }

    componentDidMount() {
        Sound.setCategory('Playback', true)
        this.alert = new Sound(alert)

        this.kbShow = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({ keyboardIsVisible: true })
        })

        this.kbHide = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({ keyboardIsVisible: false })
        })
    }

    componentWillUnmount() {
        this.kbShow.remove()
        this.kbHide.remove()
    }

    playAlert = () => {
        const resto = this.state.count % 60
        if (this.state.alerts.indexOf(resto) >= 0) {
            this.alert.play()
        }
        if (this.state.countdown === 1) {
            if (resto >= 55 && resto < 60) {
                this.alert.play()
            }
        }
    }

    play = () => {
        this.setState({
            paused: false,
            count: 0,
            countdownValue: this.state.countdown === 1 ? 5 : 0
        })
        this.setState({ isRunning: true })
        const count = () => {
            if (this.state.paused) {
                return
            }
            this.setState({ count: this.state.count + 1 }, () => {
                this.playAlert()
                if (this.state.count === parseInt(this.state.time) * 60) {
                    clearInterval(this.countTimer)
                }
            })
        }

        if (this.state.countdown === 1) {
            this.alert.play()
            this.countdownTimer = setInterval(() => {
                if (this.state.paused) {
                    return
                }
                this.alert.play()

                this.setState({ countdownValue: this.state.countdownValue - 1 })

                if (this.state.countdownValue === 0) {
                    clearInterval(this.countdownTimer)
                    this.countTimer = setInterval(count, 1000)

                }
            }, 1000)
        } else {
            this.countTimer = setInterval(count, 1000)
        }
    }

    stop = () => {
        //clearInterval(this.countdownTimer)
        //clearInterval(this.countTimer)
        this.setState({
            paused: !this.state.paused
        })
    }

    back = () => {
        if (this.state.paused || !this.state.isRunning) {
            clearInterval(this.countTimer)
            clearInterval(this.countdownTimer)
            this.props.navigation.goBack()
        }
    }

    restart = () => {
        if (this.state.paused) {
            clearInterval(this.countTimer)
            clearInterval(this.countdownTimer)
            this.play()
        }
    }

    render() {
        if (this.state.isRunning) {
            const percMinute = parseInt(((this.state.count % 60) / 60) * 100)
            const percTime = parseInt(((this.state.count / 60) / parseInt(this.state.time)) * 100)
            const opacity = !this.state.paused ? 0.6 : 1

            return (
                <BackgroundProgress percentage={percMinute} style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <KeepAwake />
                        <View style={{ flex: 1 }}>
                            <Title title={'EMOM'} subtitle={'Every Minute On the Minute'} style={{ paddingTop: this.state.keyboardIsVisible ? 20 : 100 }} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Time time={this.state.count} />
                            <ProgressBar percentage={percTime} />
                            <Time time={parseInt(this.state.time) * 60 - this.state.count} type='text2' appendedText={' restantes'} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            {
                                this.state.countdownValue > 0 ?
                                    <Text style={styles.countdown}>{this.state.countdownValue}</Text>
                                    : null
                            }

                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <TouchableOpacity onPress={this.back} style={{ marginBottom: 17, alignSelf: 'center', height: 30, width: 30 }} >
                                    <Image style={{ height: 30, width: 30, opacity }} source={require('../../assets/img/back.png')} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.stop} style={{ marginBottom: 17, alignSelf: 'center', height: 30, width: 30 }} >
                                    {
                                        this.state.paused ?
                                            <Image style={{ height: 30, width: 30 }} source={require('../../assets/img/play.png')} />
                                            : <Image style={{ height: 30, width: 30 }} source={require('../../assets/img/stop.png')} />

                                    }

                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.restart} style={{ marginBottom: 17, alignSelf: 'center', height: 30, width: 30 }} >
                                    <Image style={{ height: 30, width: 30, opacity }} source={require('../../assets/img/refresh.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </BackgroundProgress>
            )
        }
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <ScrollView style={styles.container}>
                    <Title title={'EMOM'} subtitle={'Every Minute On the Minute'} style={{ paddingTop: this.state.keyboardIsVisible ? 20 : 100 }} />
                    <Image style={{ marginBottom: 17, alignSelf: 'center', height: 30, width: 30 }} source={require('../../assets/img/cog.png')} />
                    <Select
                        label='Alertas:'
                        current={this.state.alerts}
                        options={[
                            {
                                id: 0,
                                label: '0s'
                            }, {
                                id: 15,
                                label: '15s'
                            }, {
                                id: 30,
                                label: '30s'
                            }, {
                                id: 45,
                                label: '45s'
                            }
                        ]}
                        onSelect={opt => this.setState({ alerts: opt })}

                    />
                    <Select
                        label='Contagem regressiva:'
                        current={this.state.countdown}
                        options={[
                            {
                                id: 1,
                                label: 'sim'
                            }, {
                                id: 0,
                                label: 'não'
                            }
                        ]}
                        onSelect={opt => this.setState({ countdown: opt })}
                    />

                    <Text style={styles.label}> Quantos minutos: </Text>
                    <TextInput style={styles.input} value='15' keyboardType='numeric' value={this.state.time} onChangeText={text => this.setState({ time: text })} />
                    <Text style={styles.label}> minutos </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <TouchableOpacity onPress={this.back} style={{ marginBottom: 17, alignSelf: 'center', height: 30, width: 30 }} >
                            <Image style={{ height: 30, width: 30 }} source={require('../../assets/img/back.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.play} style={{ marginBottom: 17, alignSelf: 'center', height: 50, width: 50 }} >
                            <Image style={{ height: 50, width: 50 }} source={require('../../assets/img/play.png')} />
                        </TouchableOpacity>

                        <Text>Testar</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        )
    }

}

EMOMScreen.navigationOptions = {
    header: null
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D6304A'
    },
    label: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 18
    },
    input: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Ubuntu-Regular',
        fontSize: 34
    },
    countdown: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 90,
        textAlign: 'center',
        color: 'white'
    }
})



export default EMOMScreen  