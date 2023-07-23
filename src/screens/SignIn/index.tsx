import * as WebBrownser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

import { Container, Slogan, Title } from './styles';
import BackgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button';

import { ANDROID_CLIENT_ID } from '@env'
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Realm, useApp} from '@realm/react'


// cuida da interface do navegador que ocorre fora do app
WebBrownser.maybeCompleteAuthSession()

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const app = useApp()

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId : ANDROID_CLIENT_ID,
    scopes: ['profile', 'email']
  })

  function handleGoogleSignIn() {
    setIsAuthenticating(true)

    googleSignIn().then((response)=> {
      if(response.type !== "success") {
        setIsAuthenticating(false)
      }
    })
  }

  useEffect(()=>{
    if(response?.type === "success") {
      if(response.authentication?.idToken){
        const credentials = Realm.Credentials.jwt(response.authentication.idToken)

        app.logIn(credentials).catch((erro)=>{
          console.log(erro)
          Alert.alert('Entrar', 'Não foi possível conectar')
          setIsAuthenticating(false)

        })

      } else {
        Alert.alert('Entrar', 'Não foi possível conectar')
        setIsAuthenticating(false)
      }
    }
  }, [response])

  return (
    <Container source={BackgroundImg}>
      <Title>
        Ignite Fleet
      </Title>

      <Slogan>
        Gestão de uso de veículos
      </Slogan>

      <Button 
        title='Entrar com Google' 
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating} 
      />

    </Container>
  );
}
