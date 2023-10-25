import React from 'react';
import {Layout} from "antd";
import {Content, Footer, Header} from "antd/es/layout/layout";
import RoomPage from "./room/RoomPage";

const headerStyle: React.CSSProperties = {
    padding: 0,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
};


const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    backgroundColor: '#efefef',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
};

const layoutStyle: React.CSSProperties = {
    height: '100vh',
    width: '100vw',
};

const Main = () => {
    return (
            <Layout style={layoutStyle}>
                <Header style={headerStyle}>Чат приложение</Header>
                <Content style={contentStyle}>
                    <RoomPage/>
                </Content>
                <Footer style={footerStyle}>Тест</Footer>
            </Layout>
    );
};

export default Main;