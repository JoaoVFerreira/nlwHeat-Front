import { useContext } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { authContext } from '../../context/auth';

import styles from './styles.module.scss';


export function LoginBox() {
  const { signInUrl } = useContext(authContext);

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signWithGithub}>
        <VscGithubInverted size="24"/>
        Entrar com GitHub
      </a>
    </div>
  )
}