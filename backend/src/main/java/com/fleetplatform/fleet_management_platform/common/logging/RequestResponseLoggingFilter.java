package com.fleetplatform.fleet_management_platform.common.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(1)
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestResponseLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        long start = System.currentTimeMillis();

        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - start;
            int status = response.getStatus();

            String query = request.getQueryString();
            String uri = query != null
                    ? request.getRequestURI() + "?" + query
                    : request.getRequestURI();

            if (status >= 500) {
                log.error("{} {} -> {} ({}ms)", request.getMethod(), uri, status, duration);
            } else if (status >= 400) {
                log.warn("{} {} -> {} ({}ms)", request.getMethod(), uri, status, duration);
            } else {
                log.info("{} {} -> {} ({}ms)", request.getMethod(), uri, status, duration);
            }
        }
    }
}
