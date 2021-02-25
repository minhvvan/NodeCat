const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/test', async (req, res, next) => { //토큰 테스트 라우터
    try{
        if(!req.session.jwt){
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret: process.env.CLIENT_SECRET,
            });
            if(tokenResult.data && tokenResult.data.code === 200){ //토큰 발급 성공
                req.session.jwt = tokenResult.data.token; // 토큰 저장
            }else{//토큰 발급 실패
                return res.json(tokenResult.data);
            }
        }
        //토큰 테스트
        const result = await axios.get('http://localhost:8002/v1/test', {
            headers: {authorization: req.session.jwt},
        });
        return res.json(result.data);
    }catch(err){
        console.error(err);
        if(err.response.status === 419){// 토큰 만료 시
            return res.json(err.response.data);
        }
        return next(err);
    }
});

module.exports = router;