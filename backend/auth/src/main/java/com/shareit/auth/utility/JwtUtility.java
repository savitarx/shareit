package com.shareit.auth.utility;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import org.bouncycastle.jcajce.provider.asymmetric.RSA;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Key;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
@Component
public class JwtUtility {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long expiration;

    private Key secretKey;

    private PrivateKey privateKey;




    @PostConstruct
    public void init() throws Exception {
        InputStream is = new ClassPathResource("private.pem").getInputStream();
        String key = new String(is.readAllBytes());
        key = key.replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replace("\n", "")

                .replace("\r", "")

                .trim();

        byte[] decoded = Base64.getDecoder().decode(key);

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);

        KeyFactory kf = KeyFactory.getInstance("RSA");

        privateKey = kf.generatePrivate(spec);

    }


    public String generateToken(String username){
        return Jwts.builder().
                setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expiration))
                .signWith(privateKey,SignatureAlgorithm.RS256)
                .compact();
    }
}
