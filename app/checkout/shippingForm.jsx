import { useState } from 'react'
import countries from '../JSON/countries.json'


export default function ShippingForm ({ImageUrl, setPayment}) {
    const [page, setPage] = useState('personal')
  console.log(setPayment)

    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      address1: '',
      phone: '',
      city: '',
      state: '',
      zipCode: '',
      //province: '',
      countryCode: '',
      address2: '',
      company: '',
      quantity: '',
      lineItemPrintUrl: ImageUrl
    });
  
    const placeOrder = async (event) => {
      event.preventDefault(); // To prevent form from actually submitting to a page
  
      try {
        const response = await fetch('/api/create-order', { // replace with your API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
      } catch (error) {
        console.log(error);
      }
    }

    const submitPage = (e) => {
      e.preventDefault()
      if(page === 'personal') {
        setPage('shipping')
      } else if (page ==='shipping') {
        setPage('payment')
      } else {
        setPayment(true);
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
                        key="address1"
                        type='text'
                        name="address1"
                        placeholder="Street Address Line 1"
                        value={formData["city"]}
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
              <button 
                className="px-2 py-2 bg-white shadow-lg border rounded text-center"
                type="submit">Continue
              </button>
            </div>
          </form>
        </div>
    );
}