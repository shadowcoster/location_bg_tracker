import { Image, Text, View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { Imageconstants } from '../../../utility/imageconstants';
type HeaderItem = {
  name: string;
  value: string;
  onPress?: () => void;
};

type GlobalHeaderProps = {
  data: HeaderItem;
};
const GlobalHeader: React.FC<GlobalHeaderProps> = ({ data }) => {
  console.log('data', data.value);
  return (
    <View>
      <View style={styles.parentView}>
        <View style={styles.viewFlex}>
            <Image source={Imageconstants.backArrow} style={{height:20,width:20}} />
        </View>
        <View style={styles.viewFlex}>
          <Text style={styles.textStyle}>{data.value}</Text>
        </View>

        <View></View>
      </View>
    </View>
  );
};

export default GlobalHeader;
