import { Formik, useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const UpdateUser = () => {

    const navigate = useNavigate();
    const [image, setImage] = useState('');

    const { id } = useParams();

    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/getid/` + id);
        const data = await res.json();
        setUserData(data);
        setImage(data.avatar); // Initialize with existing avatar
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const uploadFile = async (e) => {
        let file = e.target.files[0];

        const fd = new FormData();
        fd.append('myfile', file);

        const res = await fetch(`${process.env.REACT_APP_API_URL}/util/uploadfile`, {
            method: 'POST',
            body: fd
        });

        if (res.status === 200) {
            const data = await res.json();
            setImage(data.fileName); // Update with new filename
        }
    }


    return (
        <div>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card w-50 shadow-lg rounded-5 glass-navbar">
                    <div className="card-body p-5">
                        <h4 className="text-center my-3 fw-bold">Edit Profile</h4>
                        {
                            userData !== null ? (
                                <Formik initialValues={userData}
                                    onSubmit={async (values) => {
                                        values.avatar = image;
                                        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/update/` + id, {
                                            method: 'PUT',
                                            body: JSON.stringify(values),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });

                                        if (res.status === 200) {
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Update Success',
                                            });
                                            navigate('/manageuser');
                                        }
                                        else {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Oops!!',
                                                text: 'Some Error Occurred'
                                            });
                                        }
                                    }}>
                                    {
                                        ({ values, handleSubmit, handleChange, touched, errors }) => (

                                            <form onSubmit={handleSubmit}>

                                                {/* Image Preview with cache busting */}
                                                <div className="text-center mb-4">
                                                    <img
                                                        src={image && image.startsWith('http') ? image : (image ? `${process.env.REACT_APP_API_URL}/${image}?t=${new Date().getTime()}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png')}
                                                        alt="Profile"
                                                        className="rounded-circle shadow-sm"
                                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label ms-1">Name</label>
                                                    <input className="form-control rounded-3" type="text" name="name" onChange={handleChange} value={values.name} />
                                                    <p className='text-danger small ms-1'>{touched.name ? errors.name : ''}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label ms-1">Email</label>
                                                    <input className="form-control rounded-3" type="email" name="email" onChange={handleChange} value={values.email} />
                                                    <p className='text-danger small ms-1'>{touched.email ? errors.email : ''}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label ms-1">Role</label>
                                                    <select className="form-select rounded-3" name="role" onChange={handleChange} value={values.role}>
                                                        <option value="user">Customer</option>
                                                        <option value="seller">Seller</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label ms-1">New Password (leave blank to keep current)</label>
                                                    <input className="form-control rounded-3" type="password" name="password" onChange={handleChange} value={values.password} />
                                                    <p className='text-danger small ms-1'>{touched.password ? errors.password : ''}</p>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="form-label ms-1">Update Profile Picture</label>
                                                    <input type="file" className="form-control rounded-3" onChange={uploadFile} />
                                                </div>

                                                <div>
                                                    <button type='submit' className="btn btn-dark w-100 py-2 rounded-pill fw-bold shadow-sm">Save Changes</button>
                                                </div>
                                            </form>
                                        )
                                    }
                                </Formik>
                            ) :
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                        }

                    </div>
                </div>
            </div>

        </div>
    )
}

export default UpdateUser;