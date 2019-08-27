import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Title = ({ title, subtitle, style }) => {
    return (
        <View style={[styles.container, style ]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 20
    },
    title: {
        fontFamily: 'Ubuntu-Bold',
        fontSize: 40,
        color: 'white',
        textAlign: 'center'
    },
    subtitle: {
        fontFamily: 'Ubuntu-Regular',
        fontSize: 10,
        color: 'white',
        textAlign: 'center'
    }

})


export default Title