import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ManageUser = () => {

    const navigate = useNavigate();


    const [userList, setuserList] = useState([]);

    const fetchUserData = async () => {
        // Get current user from session
        const currentUser = JSON.parse(sessionStorage.getItem('user'));

        if (currentUser) {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/user/getid/` + currentUser.id); // Changed to match data structure and API endpoint
            if (res.status === 200) {
                const data = await res.json();
                setuserList([data]); // Wrap in array to keep table structure
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [])

    const deleteUser = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/delete/` + id, { method: 'DELETE' });
        if (res.status === 200) {
            fetchUserData();
            toast.success('User Deleted Successfully');
            // Optionally logout if deleting self
            if (JSON.parse(sessionStorage.getItem('user')).id === id) {
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token');
                navigate('/login');
            }
        }
    }


    const displayUsers = () => {
        return <table className='table table-bordered table-sm table-striped  '>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Image</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    userList.map((user) => (
                        <tr className='p-0' key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td className='text-center'> <img width={50} className="img-fluid  rounded-5" src={user.avatar ? `${process.env.REACT_APP_API_URL}/` + user.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="" /></td>
                            <td className='text-center'><button className='btn btn-danger' onClick={() => { deleteUser(user._id) }} >Delete Account</button> </td>
                            <td className='text-center'><button className='btn btn-primary' onClick={() => { navigate('/updateuser/' + user._id) }} >Update Profile</button> </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    };
    return (
        <div>
            <h1 className='text-center m-5'>Manage User Data</h1>
            <div className='container'>
                {displayUsers()}
            </div>
        </div>
    )
}

export default ManageUser;