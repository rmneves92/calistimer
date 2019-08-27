import React, { Component } from 'react'
import { Keyboard, ScrollView, Text, StyleSheet, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import Select from '../components/Select'
import Title from '../components/Title'
import Time from '../components/Time'
import BackgroundProgress from '../components/BackgroundProgress'
import Sound from 'react-native-sound'
import KeepAwake from 'react-native-keep-awake'

const alert = require('../../assets/sounds/alert.wav')

class IsometriaScreen extends Component {

    state = {
        keyboardIsVisible: false,

        goal: 1,
        countdown: 0,
        time: '5',

        isRunning: false,
        paused: false,
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

        //this.play()
    }

    componentWillUnmount() {
        this.kbShow.remove()
        this.kbHide.remove()
    }

    playAlert = () => {
        const { count, time } = this.state
        if (count >= parseInt(time) - 5 && count <= parseInt(time)) {
            this.alert.play()
        }
    }

    play = () => {
        const time = this.state.goal === 0 ? '0' : this.state.time

        this.setState({
            count: 0,
            countdownValue: 5,
            paused: false,
            time
        })
        this.setState({ isRunning: true })
        const count = () => {
            if (this.state.paused) {
                return
            }
            this.setState({ count: this.state.count + 1 }, () => {
                this.playAlert()

            })
        }


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
    }

    stop = () => {
        this.setState({
            paused: !this.state.paused
        })
    }

    restart = () => {
        if (this.state.paused) {
            clearInterval(this.countTimer)
            clearInterval(this.countdownTimer)
            this.play()
        }
    }

    back = () => {
        if (this.state.paused || !this.state.isRunning) {
            clearInterval(this.countTimer)
            clearInterval(this.countdownTimer)
            this.props.navigation.goBack()
        }
    }

    render() {
        if (this.state.isRunning) {
            const percMinute = this.state.time === '0' ? 0 : parseInt(((this.state.count) / parseInt(this.state.time)) * 100)
            const restante = parseInt(this.state.time) >= this.state.count ? parseInt(this.state.time) - this.state.count : 0
            const opacity = !this.state.paused ? 0.6 : 1
            return (
                <BackgroundProgress percentage={percMinute} style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <KeepAwake />
                        <View style={{ flex: 1 }}>
                            <Title title={'Isometria'} style={{ paddingTop: this.state.keyboardIsVisible ? 20 : 100 }} />
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <Time time={this.state.count} />

                            {
                                this.state.goal === 1 ? <Time time={restante} type='text2' appendedText={' restantes'} /> : null
                            }
                        </View>


                        <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'flex-end', marginBottom: 40 }}>

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
                    <Title title={'Isometria'} style={{ paddingTop: this.state.keyboardIsVisible ? 20 : 100 }} />
                    <Image style={{ marginBottom: 17, alignSelf: 'center', height: 50, width: 50 }} source={require('../../assets/img/cog.png')} />
                    <Select
                        label='Objetivo:'
                        current={this.state.goal}
                        options={[
                            {
                                id: 0,
                                label: 'livre'
                            }, {
                                id: 1,
                                label: 'bater tempo'
                            }
                        ]}
                        onSelect={opt => this.setState({ goal: opt })}

                    />

                    {
                        this.state.goal !== 0 ?
                            <React.Fragment>
                                <Text style={styles.label}> Quantos segundos: </Text>
                                <TextInput style={styles.input} value='15' keyboardType='numeric' value={this.state.time} onChangeText={text => this.setState({ time: text })} />
                            </React.Fragment>
                            : null
                    }

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

IsometriaScreen.navigationOptions = {
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



export default IsometriaScreen  