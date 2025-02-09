import Header from '../../components/Header';
// import Banner from '../../components/Banner';
import MainContent from '../../components/login/MainContent';
import Footer from '../../components/Footer';
import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-10">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default LoginPage;
