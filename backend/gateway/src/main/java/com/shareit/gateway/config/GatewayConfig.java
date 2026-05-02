package com.shareit.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()


                .route("auth", r -> r.path("/auth/**")
                        .uri("lb://AUTH"))


                .route("chat-ws", r -> r.path("/chat/ws/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb:ws://CHAT"))


                .route("chat", r -> r.path("/chat/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://CHAT"))


                .route("rooms", r -> r.path("/rooms/**")
                        .uri("lb://CHAT"))

                .build();
    }
}