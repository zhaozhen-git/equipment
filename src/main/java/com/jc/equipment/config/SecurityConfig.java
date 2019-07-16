package com.jc.equipment.config;

import com.jc.equipment.service.CustomUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Configuration
    public static class WebSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter{

        @Autowired
        CustomUserService customUserService;

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.userDetailsService(customUserService); //配置自定义userDetailService
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception{
            http.csrf().disable();
            http.authorizeRequests().antMatchers("/").permitAll();   //允许访问首页
            http.formLogin().loginPage("/login")
                    //设置默认登录成功跳转页面
                    .loginProcessingUrl("/getLogin")
                    .defaultSuccessUrl("/kpi").failureUrl("/loginError").permitAll()
                    ;
         }

    }
}

