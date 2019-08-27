import React, { Component } from 'react'
import { View, Animated } from 'react-native'

class ProgressBar extends Component {

    constructor(props) {
        super(props)
        this.width = new Animated.Value(0) // não colocar no state
    }

    componentDidUpdate(prevProps) {
        if (prevProps.percentage != this.props.percentage) {
            Animated.timing(this.width, {
                toValue: this.props.percentage,
                duration: 500,
            }).start()
        }
    }

    render() {
        const { color, height } = this.props
        const w = this.width.interpolate({ // interpolar um valor para outro
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
        })


        return (
            <View>
                <Animated.View style={{
                    width: w,
                    backgroundColor: color ? color : 'white',
                    height: height ? height : 3
                }} />
            </View>
        )
    }

}

export default ProgressBar