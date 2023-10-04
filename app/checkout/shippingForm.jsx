import { useState } from 'react'
import countries from '../JSON/countries.json'
import CheckoutButton from './checkoutButton'

export default function ShippingForm ({ImageUrl}) {
    const [orderId, setOrderId] = useState(null)
    const [page, setPage] = useState('personal')
    const [error, setError] = useState("");
    const [personalError, setPersonalError] = useState("");
    const [formData, setFormData] = useState({
      firstName: '', //required
      lastName: '', //required
      email: '',  //required
      address1: '',  //required
      phone: '',   //optional
      city: '',   //required
      state: '',  //required
      zipCode: '',  //required
      countryCode: '',  //required
      address2: '', //optional
      company: '', //optional
      quantity: '1', //preset
      lineItemPrintUrl: ImageUrl
    });

    const [loading, setLoading] = useState(false);

    const validateForm = () => {
      if (!formData.countryCode) {
        setError("Country is required");
        return false;
      }
      if (!formData.state) {
        setError("State is required");
        return false;
      }
      if (!formData.city) {
        setError("City is required");
        return false;
      }
      if (!formData.zipCode) {
        setError("Zip code is required");
        return false;
      }
      if (!formData.address1) {
          setError("Address line 1 is required");
          return false;
      }      
     
      setError("");
      return true;
  }

  const validatePersonalForm = () => {
    console.log('hit')
    if (!formData.firstName) {
      console.log('hit')
        setPersonalError("First name is required");
        return false;
    }
    if (!formData.lastName) {
        setPersonalError("Last name is required");
        return false;
    }
    if (!formData.email) {
        setPersonalError("Email is required");
        return false;
    }
    setPersonalError("");
    return true;
  }
  
    const placeOrder = async (event) => {  
      try {
        setLoading(true);
        const response = await fetch('/api/create-order', { // replace with your API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        setOrderId(data.orderId);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }

    const submitPage = (e) => {
      e.preventDefault();
  
      if (page === 'personal') {
          if (!validatePersonalForm()) {
            return;
          }
          setPage('shipping');
      } else if (page === 'shipping') {
          if (!validateForm()) {
            return;
          }
          setPage('payment');
      } else {
          placeOrder();
      }
  }
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  
    return (
        <div className="bg-white rounded-lg flex flex-col items-center justify-center p-8 mx-4 min-w-[50%] shadow-xl">
          <form onSubmit={submitPage}>
            <div className="flex flex-col justify-center items-center">
              <div  className="flex"> 
                <div className="flex flex-col  justify-center w-full">
                  {page==='personal' ? (<>
                    <h1 className="mb-2">Personal</h1>
                    {personalError && <p className="text-red-500 mb-2">{personalError}</p>}
                    <input
                        key="firstName"
                        type='text'
                        name="firstName"
                        placeholder="First Name"
                        value={formData["firstName"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    <input
                        key="lastName"
                        type='text'
                        name="lastName"
                        placeholder="Last Name"
                        value={formData["lastName"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    <input
                        key="email"
                        type='text'
                        name="email"
                        placeholder="Email"
                        value={formData["email"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    <input
                        key="phone"
                        type='text'
                        name="phone"
                        placeholder="Phone Number"
                        value={formData["phone"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    <input
                        key="company"
                        type='text'
                        name="company"
                        placeholder="Company Name"
                        value={formData["company"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    </>  ) : page==='shipping' ? (
                    <>
                    <h1 className="mb-2">Shipping</h1>
                    {error && <p className="text-red-500 mb-2">{error}</p>}

                      <select
                      key="countryCode"
                      type='text'
                      name="countryCode"
                      placeholder="Country"
                      value={formData["firstName"]}
                      className="border rounded mb-2 p-4"
                      onChange={handleChange}>
                        <option value="personal">Select Country</option>
                        {countries.map((country, i) => {
                          return <option key={i} value={country.Code}>{country.Name}</option>
                        })}
                      </select>
                    <input
                        key="state"
                        type='text'
                        name="state"
                        placeholder="State"
                        value={formData["state"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    <input
                        key="city"
                        type='text'
                        name="city"
                        placeholder="City"
                        value={formData["city"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    <input
                        key="zipCode"
                        type='text'
                        name="zipCode"
                        placeholder="Zipcode"
                        value={formData["zipCode"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />
                    <input
                        key="address1"
                        type='text'
                        name="address1"
                        placeholder="Street Address Line 1"
                        value={formData["address1"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />    
                    <input
                        key="address2"
                        type='text'
                        name="address2"
                        placeholder="Street Address Line 2"
                        value={formData["address2"]}
                        className="border rounded mb-2 p-4"
                        onChange={handleChange}
                    />                   
                    </>
                  ): (<></>)}
                </div>
              </div>
              {orderId ? (
                <CheckoutButton orderId={orderId}/>
              ): (
                page === 'payment'? (
                  loading ? (<></>) : (<button onClick={placeOrder}>Place Order</button>)   
                ) : (<>
                  <button 
                className="px-2 py-2 bg-white shadow-lg border rounded text-center"
                type="submit">Continue
                  </button>
                </>)
              )}
              
            </div>
          </form>
        </div>
    );
}