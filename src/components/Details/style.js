import styled from 'styled-components/native'

export const Container = styled.View`
    background: #FFF;
    height: 300px;
    width: 100%;
    position: absolute;
    bottom: 0;
    shadow-color: #000;
    shadow-offset: 0 0;
    shadow-opacity: 0.2;
    shadow-radius: 10;
    elevation: 5;
    border: 1px solid #DDD;
    align-items: center;
    padding: 20px;
`

export const TypeTitle = styled.Text`
   text-align: center;
   font-size: 20px;
   color: #222;
`

export const TypeDescription = styled.Text`
   color: #666;
   font-size: 14px;
`

export const TypeImage = styled.Image`
   height: 80px;
   margin: 10px 0;
`

export const RequestButton = styled.TouchableOpacity`
   background: red;
   justify-content: center;
   align-items: center;
   height: 44px;
   align-self: stretch;
   margin-top: 10px;
`

export const RequestButtonText = styled.Text`
   color: #FFF;
   font-weight: bold;
   font-size: 18px;
`
export const RestaurantButton = styled.TouchableOpacity`
   background: green;
   justify-content: center;
   align-items: center;
   height: 44px;
   align-self: stretch;
   margin-top: 10px;
`