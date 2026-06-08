package com.yestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
// 이 클래스가 있는 패키지 하위를 전부 스캔해서 Bean 등록
@SpringBootApplication
public class YestionApplication {
    public static void main(String[] args) {
        SpringApplication.run(YestionApplication.class, args);
    }
}
