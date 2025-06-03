import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { fireDB } from '../../firebase/FirebaseConfig';
import { Timestamp, addDoc, collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getStorage, ref, deleteObject } from "firebase/storage";
import { deleteDoc, doc, updateDoc  } from "firebase/firestore";



function MyState(props) {
  const [mode, setMode] = useState('light');  
  const [loading, setLoading] = useState(false); 

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = 'rgb(17, 24, 39)';
    }
    else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  }

  const [products, setProducts] = useState({
    title: null,
    price: null,
    imageUrl: null,
    category: null,
    description: null,
    time: Timestamp.now(),
    date: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )

  })

  // ********************** Add Product Section  **********************
  const addProduct = async () => {
    if (products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null) {
      return toast.error('Please fill all fields')
    }
    const productRef = collection(fireDB, "products")
    setLoading(true)
    try {
      await addDoc(productRef, products)
      toast.success("Product Add successfully")
      window.location.href = '/dashboard';
      getProductData()
      closeModal()
      setLoading(false)
      //directed to the dashboard page
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setProducts("")
  }

  const [product, setProduct] = useState([]);

  // ****** get product
  const getProductData = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(fireDB, "products"),
        orderBy("time"),
        // limit(5)
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productsArray)
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getProductData();
  }, []);

  
  
// //update products functions
// const edithandle = (item)=> {
//   setProduct(item)
// }
// //for update a product
//  const updateProduct =async (item)=> {
//   setLoading(true)
//   try{
//     await setDoc(doc(fireDB, "products", products.id),products);
//     toast.success("Priduct updated successfully")
//     getProductData();
//     setLoading(false)
//     window.location.href ='/dashboard'
//   }catch(error){
//     console.log(error)
//   }
//   setProducts("")
//  }

// Edit handler to set the product to be edited
const edithandle = (item) => {
  setProducts(item); // Assuming 'products' is the state holding the current product's data
};

// Function to update a product
const updateProduct = async () => {
  setLoading(true);
  try {
    // Ensure that 'products' has an 'id' field
    if (!products.id) {
      throw new Error("Product ID is missing.");
    }

    // Reference to the specific document in Firestore
    const productRef = doc(fireDB, "products", products.id);

    // Prepare the updated fields
    const updatedFields = {
      title: products.title,
      price: products.price,
      imageUrl: products.imageUrl,
      category: products.category,
      description: products.description,
      // Add other fields as necessary
    };

    // Update the document with the new fields
    await updateDoc(productRef, updatedFields);

    toast.success("Product updated successfully");
    getProductData(); // Refresh the product data
    setLoading(false);
    window.location.href = '/dashboard'; // Redirect to dashboard
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Failed to update product");
    setLoading(false);
  } finally {
    // Reset the product state
    setProducts({
      title: null,
      price: null,
      imageUrl: null,
      category: null,
      description: null,
      time: Timestamp.now(),
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    });
  }
};

  // const edithandle = (item) => {
  //   setProduct(item);
  // };
  
  // // Function to update a product
  // const updateProduct = async () => {
  //   setLoading(true);
  //   try {
  //     if (!product.id) {
  //       throw new Error("Product ID is missing.");
  //     }
  
  //     const productRef = doc(fireDB, "products", product.id);
  
  //     // Prepare the fields to update
  //     const updatedFields = {
  //       name: product.name,
  //       price: product.price,
  //       description: product.description,
  //       category: product.category,
  //       // Add other fields as necessary
  //     };
  
  //     // Validate that none of the fields are undefined
  //     for (const [key, value] of Object.entries(updatedFields)) {
  //       if (value === undefined) {
  //         throw new Error(`Field '${key}' is undefined.`);
  //       }
  //     }
  
  //     await updateDoc(productRef, updatedFields);
  
  //     toast.success("Product updated successfully");
  //     getProductData();
  //     setLoading(false);
  //     window.location.href = '/dashboard';
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //     toast.error("Failed to update product");
  //     setLoading(false);
  //   } finally {
  //     setProduct({});
  //   }
  // };



   //for delete product
  //  const deleteProduct = async (item) => {

  //   try {
  //     setLoading(true)
  //     await deleteDoc(doc(fireDB, "products", item.id));
  //     toast.success('Product Deleted successfully')
  //     setLoading(false)
  //     setTimeout(()=>{
  //       window.location.herf ='/dashboard'
  //     }, 8000);

  //     getProductData()
  //   } catch (error) {
  //     // toast.success('Product Deleted Falied')
  //     setLoading(false)
  //   }
  // }


const deleteProduct = async (item) => {
  try {
    setLoading(true);

    // Delete the Firestore document
    await deleteDoc(doc(fireDB, "products", item.id));

    // Delete the associated image from Firebase Storage
    if (item.imagePath) {
      const storage = getStorage();
      const imageRef = ref(storage, item.imagePath);
      await deleteObject(imageRef);
    }

    toast.success('Product deleted successfully');
    setLoading(false);

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 8000);

    // Refresh product data
    getProductData();
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error('Failed to delete product');
    setLoading(false);
  }
};
 
const [order, setOrder] = useState([]);

const getOrderData = async () => {
  setLoading(true)
  try {
    const result = await getDocs(collection(fireDB, "order"))
    const ordersArray = [];
    result.forEach((doc) => {
      ordersArray.push(doc.data());
      setLoading(false)
    });
    setOrder(ordersArray);
    console.log(ordersArray)
    setLoading(false);
  } catch (error) {
    console.log(error)
    setLoading(false)
  }
}




const [user, setUser] = useState([]);

const getUserData = async () => {
  setLoading(true)
  try {
    const result = await getDocs(collection(fireDB, "users"))
    const usersArray = [];
    result.forEach((doc) => {
      usersArray.push(doc.data());
      setLoading(false)
    });
    setUser(usersArray);
    console.log(usersArray)
    setLoading(false);
  } catch (error) {
    console.log(error)
    setLoading(false)
  }
}

useEffect(() => {
  getProductData();
  getOrderData();
  getUserData();
  getProductCount();
  getOrderCount();
  getUserCount();
}, []);


const [searchkey, setSearchkey] = useState('')
const [filterType, setFilterType] = useState('')
const [filterPrice, setFilterPrice] = useState('')

const [counts, setCounts] = useState({
  products: 0,
  orders: 0,
  users: 0
});

// Get product count
const getProductCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(fireDB, "products"));
    setCounts(prev => ({...prev, products: querySnapshot.size}));
  } catch (error) {
    console.error("Error getting product count:", error);
  }
};

// Get order count
const getOrderCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(fireDB, "order"));
    setCounts(prev => ({...prev, orders: querySnapshot.size}));
  } catch (error) {
    console.error("Error getting order count:", error);
  }
};

// Get user count
const getUserCount = async () => {
  try {
    const querySnapshot = await getDocs(collection(fireDB, "users"));
    setCounts(prev => ({...prev, users: querySnapshot.size}));
  } catch (error) {
    console.error("Error getting user count:", error);
  }
};

  return (
    <MyContext.Provider value={{ 
      mode, toggleMode, loading,setLoading,
      products, setProducts,addProduct,product, edithandle, updateProduct, deleteProduct, order, user, getProductData,  searchkey, setSearchkey,filterType, setFilterType,
      filterPrice, setFilterPrice, counts}}>
      {props.children}
    </MyContext.Provider>
  )
}

export default MyState