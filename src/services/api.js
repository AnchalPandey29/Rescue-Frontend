import axios from 'axios';
const apiRequest = async(url, method, body={},headers)=>{
    try{
        const token = localStorage.getItem("token");
        const config={
            method,
            url,
            data:body,
            headers: headers || {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }), // Only add Authorization if token exists
            },
            
        };
        
        const response = await axios(config);
        return response;
    }catch(error)
    {
        if(error.response)
        {
            console.error('Error response', error.response);
            return{
                status: error.response.status,
                message: error.response.data || 'An error occured.',
            };
        }
        else if (error.request)
        {
            console.error('Error request',error.request);
            return {message:'No response recieved from server.'};
        }
        else{
            console.error('Error',error.message);
            return{message: error.message};
        }
    }
};
export default apiRequest;