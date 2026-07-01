import { View, } from 'react-native'
import React from 'react'
import { styles } from './styles'
import GlobalHeader from '../../components/enzymes/header'

const Login :React.FC = () => {
   const headerData = 
    {
      name: 'SpiderX',
      value: 'SpiderX',
      onPress: () => {
      
      },
    };
  return (
    <View style={styles.v1}>
    <GlobalHeader key={1} data={headerData} />
    </View>
  )
}

export default Login

