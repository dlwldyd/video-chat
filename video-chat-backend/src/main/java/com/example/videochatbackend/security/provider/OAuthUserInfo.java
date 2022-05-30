package com.example.videochatbackend.security.provider;

import java.util.Map;

public interface OAuthUserInfo {

    String getProviderId();

    String getProvider();

    String getEmail();

    String getName();

    Map<String, Object> getAttributes();
}
