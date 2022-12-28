import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<App/>);
function App(){
    return <div>Hello World</div>
}