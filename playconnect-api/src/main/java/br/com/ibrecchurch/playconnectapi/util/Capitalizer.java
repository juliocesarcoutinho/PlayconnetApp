package br.com.ibrecchurch.playconnectapi.util;

public class Capitalizer {

    public static String capitalizeWords(String name) {
        if (name == null || name.isEmpty()) {
            return name;
        }
        String[] words = name.split("\\s+");
        StringBuilder capitalized = new StringBuilder();
        for (String word : words) {
            if (word.length() > 0) {
                capitalized.append(word.substring(0, 1).toUpperCase())
                           .append(word.substring(1).toLowerCase())
                           .append(" ");
            }
        }
        return capitalized.toString().trim();
    }
}