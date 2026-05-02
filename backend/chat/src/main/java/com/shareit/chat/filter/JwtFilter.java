package com.shareit.chat.filter;

import com.shareit.chat.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil){
        this.jwtUtil=jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        System.out.println("Path"+path);
        if (path.startsWith("/ws")) {
            filterChain.doFilter(request, response);
            return;
        }



        String header =request.getHeader("Authorization");
        if(header!=null && header.startsWith("Bearer ")){
            System.out.println("Filter added "+path);

            try{
                String username= jwtUtil.validateTokenAndGetUser(header);
                UsernamePasswordAuthenticationToken auth= new UsernamePasswordAuthenticationToken(username,null, List.of());
                SecurityContextHolder.getContext().setAuthentication(auth);

            }
            catch (Exception e){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request,response);
    }
}
