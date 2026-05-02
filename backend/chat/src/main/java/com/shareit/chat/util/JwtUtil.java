package com.shareit.chat.util;


import io.jsonwebtoken.Claims;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class JwtUtil {

    private PublicKey publicKey;

    @PostConstruct
    public void init() throws Exception{
        InputStream is = new ClassPathResource("public.pem").getInputStream();

        String key = new String(is.readAllBytes());


        key = key.replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "").replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(key);

        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");

        publicKey = kf.generatePublic(spec);

    }

    public String generateToken(String token){
        return io.jsonwebtoken.Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token.replace("Bearer ",""))
                .getBody()
                .getSubject();
    }

    public String validateTokenAndGetUser(String token){
        if(token==null || token.isEmpty()){
            throw  new RuntimeException("Missing Token");
        }

        try{
            String jwt = token.replace("Bearer ","");
            Claims claims = io.jsonwebtoken.Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            return claims.getSubject();
        }

        catch (io.jsonwebtoken.ExpiredJwtException e){
            throw  new RuntimeException("jwt expired");
        }
        catch (Exception e){
            throw new RuntimeException("Invalid token");
        }
    }
}
