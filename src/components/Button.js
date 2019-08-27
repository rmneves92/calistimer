import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const Button = props => {
    return (
        <TouchableOpacity onPress={props.onPress} style={props.style}>
            <Text style={[styles.text, props.styleText]}>{props.children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontFamily: 'Ubuntu-Regular',
        textAlign: 'center',
        fontSize: 18
    }
})

export default Button