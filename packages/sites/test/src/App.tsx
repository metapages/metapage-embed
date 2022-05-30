import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import { Route as RouteEmbedMetaframe} from './modules/routes/embed-metaframe';
import { Route as RouteEmbedMetapage} from './modules/routes/embed-metapage';
import { Route as RouteHome} from './modules/routes/home';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<RouteHome />} />
        <Route path="/embed-metaframe" element={<RouteEmbedMetaframe />} />
        <Route path="/embed-metapage" element={<RouteEmbedMetapage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
