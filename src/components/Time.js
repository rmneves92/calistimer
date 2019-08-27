import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Timer = props => {
    const minutes = parseInt(props.time / 60)
    const seconds = parseInt(props.time % 60)
    const format = num => {
        if (num < 10) {
            return '0' + num
        } else {
            return num
        }
    }
    return (
        <Text style={styles[props.type ? props.type : 'text']}>
            {format(minutes)}: {format(seconds)} {props.appendedText}
        </Text>
    )

}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 90,
        color: 'white',
        textAlign: 'center'
    },
    text2: {
        fontFamily: 'Ubuntu-Light',
        fontSize: 24,
        color: 'white',
        textAlign: 'center'
    },
    text3: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
    }
})

export default Timer   