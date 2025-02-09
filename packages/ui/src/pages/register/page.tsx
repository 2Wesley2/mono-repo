import Header from '../../components/Header';
import Banner from '../../components/Banner';
import MainContent from '../../components/register/Register';
import Footer from '../../components/Footer';
import React from 'react';

const Register = () => {
  return (
    <div className="flex flex-col gap-10">
      {/* <Banner /> */}
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default Register;
