import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';;
import LoginRegister from './components/auth/LoginRegister';
import ProductTable from './components/product/productTable';
import { store } from './redux/store/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/products" element={<ProductTable />} />
      </Routes>
    </BrowserRouter>
    </Provider>
);
