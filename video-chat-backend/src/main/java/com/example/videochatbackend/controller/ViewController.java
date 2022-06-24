package com.example.videochatbackend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping({"/", "/fetch", "/login", "/searchRoom"})
    public String home() {
        return "index.html";
    }
}
