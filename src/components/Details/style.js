import styled from 'styled-components/native'

export const Container = styled.View`
    background: ${props => props.status !== 'pending' ? 'rgba(0, 0, 0, 0)' : 'rgba(62, 65, 126, 0.9)' };
    height: 220px;
    width: 100%;
    position: absolute;
    bottom: 0;
    shadow-color: ${props => props.status !== 'pending' ? 'transparent' : '#000' };
    shadow-offset: 0 0;
    shadow-opacity: ${props => props.status !== 'pending' ? 0 : 0.2 };
    shadow-radius: ${props => props.status !== 'pending' ? 0 : 10 };
    elevation: ${props => props.status !== 'pending' ? 0 : 10 };
    align-items: center;
    padding: 10px;
    border-top-start-radius: 15px;
    border-top-end-radius: 15px;
`

export const TypeTitle = styled.Text`
   text-align: center;
   font-size: 20px;
   color: #FFF;
`

export const TypeDescription = styled.Text`
   color: #FFF;
   font-size: 14px;
`

export const TypeImage = styled.Image`
   height: 120px;
   margin: 10px 0;
`

export const RequestButton = styled.TouchableOpacity`
   background: ${props => props.status !== 'pending' ? '#54fa2a' : '#e62e00' };
   justify-content: center;
   align-items: center;
   height: 35px;
   align-self: stretch;
   margin-top: 30px;
`

export const RequestButtonText = styled.Text`
   color: #FFF;
   font-weight: bold;
   font-size: 16px;
`
export const RestaurantButton = styled.TouchableOpacity`
   background: green;
   justify-content: center;
   align-items: center;
   height: 44px;
   align-self: stretch;
   margin-top: 30px;
`