import { useState, useEffect } from 'react';
import API from '../api/axios';

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/products/categories');
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, fetchCategories };
};

export default useCategories;