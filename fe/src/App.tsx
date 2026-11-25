import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Sender from './app/Sender'
import Reciever from './app/Reciever'
export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sender" element ={<Sender/>}/>
          <Route path="/reciever" element ={<Reciever/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

