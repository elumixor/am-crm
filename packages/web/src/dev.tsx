import React from 'react';
import { renderToString } from 'react-dom/server';

const App = () => <h1>AM CRM Web UI</h1>;

if (import.meta.main) {
  console.log(renderToString(<App />));
}
