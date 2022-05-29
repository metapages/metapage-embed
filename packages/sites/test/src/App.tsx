import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { MyButton } from '@metapages/metapage-embed-react';
import { Route, Routes } from 'react-router-dom';
import { Route as RouteEmbed} from './modules/routes/embed';
import { Route as RouteHome} from './modules/routes/home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RouteHome />} />
        <Route path="/embed" element={<RouteEmbed />} />
      </Routes>
    </div>
  )
}

export default App
