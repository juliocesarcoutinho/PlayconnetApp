package br.com.ibrecchurch.playconnectapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.titan.email");
        mailSender.setPort(465);

        mailSender.setUsername("contato@toponewebdevelopers.com.br");
        mailSender.setPassword("TopOne147258#");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "false"); // Não use starttls com SSL
        props.put("mail.smtp.ssl.enable", "true"); // Habilite SSL
        props.put("mail.smtp.ssl.trust", "smtp.titan.email"); // Confiança no certificado SSL
        props.put("mail.debug", "true");

        return mailSender;
    }
}
