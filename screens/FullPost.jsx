import React from 'react';
import axios from 'axios';
import styled from 'styled-components/native';
import {View, Alert} from 'react-native';
import {Loading} from '../components/Loading';

const PostImage = styled.Image`
    border-radius: 10px;
    width: 100%;
    height: 250px;
    margin-bottom: 20px;
`;

const PostText = styled.Text`
    font-size: 18px;
    line-height: 24px;
`;

export default function FullPostScreen({route, navigation}) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState();
    const {id, title} = route.params;

    React.useEffect(() => {
        navigation.setOptions({
            title
        });
        setIsLoading(true);
        axios
        .get('https://67ca0a8d102d684575c44f7e.mockapi.io/22/' + id)
        .then(({data}) => {
            setData(data);
        })
        .catch((err) => {
            console.log(err);
            Alert.alert('error', 'fuuuuck');
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (<Loading />);
    }

    return (
        <View style={{padding:20}}>
            <PostImage source={{uri: data.imageUrl}}/>
            <PostText>{data.description}</PostText>
        </View>
    );
}