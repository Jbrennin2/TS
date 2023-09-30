"use client"
import { useSearchParams } from 'next/navigation'
import {useState} from 'react'

export default function Checkout() {

  const ImageUrl = useSearchParams().get('id')

  const inputs = ["firstName", "lastName", "email", "address1", "phone", "city", "state", "zipCode", "province", "countryCode", "address2", "company", "quantity"]

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    province: '',
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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }

  return (
    <div>
      <form onSubmit={placeOrder}>
        {inputs.map((key) => (
          <input
            key={key}
            type={key === 'email' ? 'email' : key === 'quantity' ? 'number' : 'text'}
            name={key}
            placeholder={key}
            value={formData[key]}
            onChange={handleChange}
          />
        ))}
        <button type="submit">Place order</button>
      </form>
    </div>
  );
}