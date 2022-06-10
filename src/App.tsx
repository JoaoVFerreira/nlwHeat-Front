import { useContext } from 'react';
import styles from './App.module.scss';
import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm';
import { authContext } from './context/auth';

function App() {
  const { user } = useContext(authContext);

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />
      { !!user ? <SendMessageForm/> : <LoginBox /> }
    </main>
  )
}

export default App
