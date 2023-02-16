import React from 'react';
import EditProfileForm from '../components/forms/EditProfileForm';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Profile = () => {

  const handleSubmit = (username: string, phoneNumber: string, password: string) => {
    console.log(`Submitting login credentials:`);
    console.log(`Username: ${username}`);
    console.log(`Username: ${phoneNumber}`);
    console.log(`Password: ${password}`);
    // Perform actual login logic here
  };

  return (
    <div>
      <div className='flex flex-col items-center mt-6 gap-5'>
        <div className='px-48 py-8 bg-indigo-500 rounded-3xl shadow-lg flex flex-row'>
          <h1 className='font-semibold text-2xl text-white mr-8'>Current User</h1>
          <FontAwesomeIcon icon={faUser} size="2xl" className='text-white'></FontAwesomeIcon>
        </div>
        <EditProfileForm onSubmit={handleSubmit}/>
      </div>
    </div>
  );
};

export default Profile;