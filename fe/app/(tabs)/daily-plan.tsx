import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

type ActivityStatus = "pending" | "completed" | "skipped";

type Activity = {
  id: string;
  title: string;
  time: string;
  tags: string[];
  alternatives: string[];
  status: ActivityStatus;
  energyCost: number;
};

type TimeOfDay = "morning" | "afternoon" | "evening";

type DayActivities = Record<TimeOfDay, Activity[]>;

// High-energy activities database for user1
const activitiesDatabaseUser1: Record<string, DayActivities> = {
  "day0": {
    morning: [
      {
        id: "m1-d0",
        title: "Wawel Castle Exploration",
        time: "8:00 - 10:00 AM",
        tags: ["High Energy", "Culture", "Walking"],
        alternatives: ["Kazimierz District Walk", "Main Market Square Tour"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m2-d0",
        title: "Traditional Polish Breakfast at Café Camelot",
        time: "10:15 - 11:00 AM",
        tags: ["Local Business", "Gastronomy"],
        alternatives: ["Hotel Breakfast", "Café Szafe"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m3-d0",
        title: "Main Market Square & Cloth Hall",
        time: "11:15 AM - 12:30 PM",
        tags: ["Culture", "Shopping", "Walking"],
        alternatives: ["St. Mary's Basilica", "Town Hall Tower"],
        status: "pending",
        energyCost: 15,
      },
    ],
    afternoon: [
      {
        id: "a1-d0",
        title: "Wieliczka Salt Mine Adventure",
        time: "2:00 - 5:00 PM",
        tags: ["High Energy", "Culture", "Active"],
        alternatives: ["Schindler's Factory Museum", "Walking Tour"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "a2-d0",
        title: "Coffee Break at Wedel Café",
        time: "5:30 - 6:15 PM",
        tags: ["Local Business", "Relaxation"],
        alternatives: ["Ice Cream at Lody na Starówce", "Rest at Hotel"],
        status: "pending",
        energyCost: 15,
      },
    ],
    evening: [
      {
        id: "e1-d0",
        title: "Dinner at Pod Aniołami Restaurant",
        time: "7:00 - 8:30 PM",
        tags: ["Local Business", "Gastronomy"],
        alternatives: ["Morskie Oko", "Starka Restaurant"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "e2-d0",
        title: "Evening Walk Along Planty Park",
        time: "9:00 - 10:00 PM",
        tags: ["Walking", "Nature", "Relaxation"],
        alternatives: ["Vistula Riverbank", "Old Town Night Tour"],
        status: "pending",
        energyCost: 15,
      },
    ],
  },
  "day1": {
    morning: [
      {
        id: "m1-d1",
        title: "Hiking in Zakopane Mountains",
        time: "7:00 - 9:30 AM",
        tags: ["High Energy", "Nature", "Adventure"],
        alternatives: ["Planty Park Jogging", "Vistula Riverbank Walk"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m2-d1",
        title: "Breakfast at Góralska Tradycja",
        time: "10:00 - 11:00 AM",
        tags: ["Local Business", "Mountain Cuisine"],
        alternatives: ["Café Noworolski", "Alchemia Café"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m3-d1",
        title: "Visit to Krupówki Street",
        time: "11:15 AM - 12:30 PM",
        tags: ["Shopping", "Culture", "Walking"],
        alternatives: ["Local Markets", "Souvenir Hunting"],
        status: "pending",
        energyCost: 15,
      },
    ],
    afternoon: [
      {
        id: "a1-d1",
        title: "Bike Tour Around Cracow",
        time: "1:00 - 3:00 PM",
        tags: ["High Energy", "Active", "Sightseeing"],
        alternatives: ["Kayaking on Vistula", "Rock Climbing"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "a2-d1",
        title: "Pierogi Tasting Workshop",
        time: "3:30 - 5:00 PM",
        tags: ["Gastronomy", "Interactive", "Culture"],
        alternatives: ["Food Market Tour", "Local Bakery Visit"],
        status: "pending",
        energyCost: 15,
      },
    ],
    evening: [
      {
        id: "e1-d1",
        title: "Kazimierz Jewish Quarter Walk",
        time: "6:00 - 7:30 PM",
        tags: ["Culture", "Walking", "History"],
        alternatives: ["Floriańska Street", "Plac Nowy Market"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "e2-d1",
        title: "Dinner at Zazie Bistro",
        time: "8:00 - 9:30 PM",
        tags: ["Local Business", "Gastronomy"],
        alternatives: ["Miód Malina", "Szara Kazimierz"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "e3-d1",
        title: "Live Music at Jazz Club",
        time: "10:00 - 11:30 PM",
        tags: ["Nightlife", "Culture", "Entertainment"],
        alternatives: ["Piano Bar", "Traditional Polish Music"],
        status: "pending",
        energyCost: 15,
      },
    ],
  },
  "day2": {
    morning: [
      {
        id: "m1-d2",
        title: "St. Mary's Basilica Tower Climb",
        time: "8:00 - 9:30 AM",
        tags: ["High Energy", "Culture", "Active"],
        alternatives: ["Town Hall Tower", "Cloth Hall Visit"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m2-d2",
        title: "Breakfast at Cafe Botanica",
        time: "9:45 - 10:45 AM",
        tags: ["Local Business", "Healthy"],
        alternatives: ["Moment Café", "Massolit Café & Books"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m3-d2",
        title: "Wawel Dragon's Den Visit",
        time: "11:00 AM - 12:00 PM",
        tags: ["Culture", "Walking", "Legend"],
        alternatives: ["Wawel Gardens", "Cathedral Tour"],
        status: "pending",
        energyCost: 15,
      },
    ],
    afternoon: [
      {
        id: "a1-d2",
        title: "Active Day at Tatra Mountains",
        time: "1:00 - 4:30 PM",
        tags: ["High Energy", "Nature", "Adventure"],
        alternatives: ["Ojcow National Park", "Kosciuszko Mound Hike"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "a2-d2",
        title: "Traditional Polish Tea Time",
        time: "5:00 - 6:00 PM",
        tags: ["Gastronomy", "Relaxation", "Culture"],
        alternatives: ["Coffee & Cake", "Spa Break"],
        status: "pending",
        energyCost: 15,
      },
    ],
    evening: [
      {
        id: "e1-d2",
        title: "Polish Cooking Class & Dinner",
        time: "7:00 - 9:00 PM",
        tags: ["Culture", "Gastronomy", "Interactive"],
        alternatives: ["Traditional Folk Show", "Wine Tasting"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "e2-d2",
        title: "Night Photography Walk",
        time: "9:30 - 10:30 PM",
        tags: ["Photography", "Walking", "Culture"],
        alternatives: ["Rooftop Bar", "Evening Relaxation"],
        status: "pending",
        energyCost: 15,
      },
    ],
  },
  "day3": {
    morning: [
      {
        id: "m1-d3",
        title: "Sunrise at Kosciuszko Mound",
        time: "6:30 - 8:00 AM",
        tags: ["High Energy", "Nature", "Active"],
        alternatives: ["Morning Yoga", "Planty Park Walk"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m2-d3",
        title: "Hearty Breakfast at Café Bunkier",
        time: "8:30 - 9:30 AM",
        tags: ["Local Business", "Gastronomy"],
        alternatives: ["Hotel Breakfast", "Bagel Bar"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m3-d3",
        title: "Schindler's Factory Museum",
        time: "10:00 AM - 12:30 PM",
        tags: ["Culture", "History", "Museum"],
        alternatives: ["National Museum", "Contemporary Art Gallery"],
        status: "pending",
        energyCost: 15,
      },
    ],
    afternoon: [
      {
        id: "a1-d3",
        title: "Kayaking on Vistula River",
        time: "1:30 - 3:30 PM",
        tags: ["High Energy", "Active", "Water Sports"],
        alternatives: ["Bike Rental", "Climbing Wall"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "a2-d3",
        title: "Street Food Tour in Kazimierz",
        time: "4:00 - 5:30 PM",
        tags: ["Gastronomy", "Walking", "Culture"],
        alternatives: ["Food Market", "Traditional Snacks"],
        status: "pending",
        energyCost: 15,
      },
    ],
    evening: [
      {
        id: "e1-d3",
        title: "Traditional Polish Dinner at Wesele",
        time: "6:30 - 8:00 PM",
        tags: ["Local Business", "Gastronomy", "Culture"],
        alternatives: ["Chłopskie Jadło", "U Babci Maliny"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "e2-d3",
        title: "Theatre Performance at Stary Teatr",
        time: "8:30 - 10:30 PM",
        tags: ["Culture", "Entertainment", "Arts"],
        alternatives: ["Opera House", "Cinema"],
        status: "pending",
        energyCost: 15,
      },
    ],
  },
  "day4": {
    morning: [
      {
        id: "m1-d4",
        title: "Rock Climbing at Climbing Center",
        time: "8:00 - 10:00 AM",
        tags: ["High Energy", "Active", "Adventure"],
        alternatives: ["CrossFit Session", "Swimming"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m2-d4",
        title: "Protein Breakfast at Fit Bar",
        time: "10:30 - 11:30 AM",
        tags: ["Local Business", "Healthy"],
        alternatives: ["Smoothie Bowl", "Açai Café"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m3-d4",
        title: "Explore Nowa Huta District",
        time: "12:00 PM - 1:30 PM",
        tags: ["Culture", "History", "Walking"],
        alternatives: ["Modern Art District", "Street Art Tour"],
        status: "pending",
        energyCost: 15,
      },
    ],
    afternoon: [
      {
        id: "a1-d4",
        title: "Horseback Riding in Countryside",
        time: "2:00 - 4:30 PM",
        tags: ["High Energy", "Nature", "Active"],
        alternatives: ["ATV Tour", "Mountain Biking"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "a2-d4",
        title: "Craft Beer Tasting at Local Brewery",
        time: "5:00 - 6:30 PM",
        tags: ["Gastronomy", "Culture", "Local Business"],
        alternatives: ["Wine Bar", "Cocktail Workshop"],
        status: "pending",
        energyCost: 15,
      },
    ],
    evening: [
      {
        id: "e1-d4",
        title: "Gourmet Dinner at Copernicus Restaurant",
        time: "7:30 - 9:00 PM",
        tags: ["Local Business", "Gastronomy", "Fine Dining"],
        alternatives: ["Pod Baranem", "Fiorentina"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "e2-d4",
        title: "Pub Crawl in Old Town",
        time: "9:30 - 11:30 PM",
        tags: ["Nightlife", "Social", "Walking"],
        alternatives: ["Nightclub", "Rooftop Lounge"],
        status: "pending",
        energyCost: 15,
      },
    ],
  },
  "day5": {
    morning: [
      {
        id: "m1-d5",
        title: "Morning Hike to Sokolica Peak",
        time: "7:00 - 9:30 AM",
        tags: ["High Energy", "Nature", "Adventure"],
        alternatives: ["Trail Running", "Nordic Walking"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m2-d5",
        title: "Mountain Breakfast at Shelter",
        time: "10:00 - 11:00 AM",
        tags: ["Local Business", "Mountain Cuisine"],
        alternatives: ["Picnic Lunch", "Local Inn"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "m3-d5",
        title: "Visit to Dunajec River Gorge",
        time: "11:30 AM - 1:00 PM",
        tags: ["Nature", "Sightseeing", "Walking"],
        alternatives: ["Cave Exploration", "Nature Walk"],
        status: "pending",
        energyCost: 15,
      },
    ],
    afternoon: [
      {
        id: "a1-d5",
        title: "Rafting on Dunajec River",
        time: "2:00 - 4:00 PM",
        tags: ["High Energy", "Active", "Water Adventure"],
        alternatives: ["Zip-lining", "Rope Course"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "a2-d5",
        title: "Regional Cheese Tasting",
        time: "4:30 - 5:30 PM",
        tags: ["Gastronomy", "Culture", "Local"],
        alternatives: ["Honey Tasting", "Vodka Distillery Tour"],
        status: "pending",
        energyCost: 15,
      },
    ],
    evening: [
      {
        id: "e1-d5",
        title: "Farewell Dinner at Wierzynek",
        time: "7:00 - 9:00 PM",
        tags: ["Local Business", "Gastronomy", "Fine Dining"],
        alternatives: ["Szara Gęś", "Albertina"],
        status: "pending",
        energyCost: 15,
      },
      {
        id: "e2-d5",
        title: "Bonfire & Folk Music Evening",
        time: "9:30 - 11:00 PM",
        tags: ["Culture", "Music", "Social"],
        alternatives: ["Sunset Viewing", "Stargazing"],
        status: "pending",
        energyCost: 15,
      },
    ],
  },
};

// Relaxed activities database for user2
const activitiesDatabaseUser2: Record<string, DayActivities> = {
  "day0": {
    morning: [
      {
        id: "m1-d0-u2",
        title: "Gentle Morning Yoga at Hotel",
        time: "8:30 - 9:30 AM",
        tags: ["Wellness", "Relaxation", "Low Energy"],
        alternatives: ["Meditation Session", "Light Stretching"],
        status: "pending",
        energyCost: 8,
      },
      {
        id: "m2-d0-u2",
        title: "Leisurely Breakfast at Café",
        time: "10:00 - 11:00 AM",
        tags: ["Gastronomy", "Relaxation"],
        alternatives: ["Hotel Breakfast", "Nearby Bakery"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m3-d0-u2",
        title: "Visit to National Museum",
        time: "11:30 AM - 1:00 PM",
        tags: ["Culture", "Indoor", "Calm"],
        alternatives: ["Gallery Visit", "Library Tour"],
        status: "pending",
        energyCost: 10,
      },
    ],
    afternoon: [
      {
        id: "a1-d0-u2",
        title: "Lunch at Quiet Restaurant",
        time: "1:30 - 2:30 PM",
        tags: ["Gastronomy", "Relaxation"],
        alternatives: ["Hotel Restaurant", "Café Lunch"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "a2-d0-u2",
        title: "Stroll Through Planty Park",
        time: "3:00 - 4:00 PM",
        tags: ["Nature", "Walking", "Calm"],
        alternatives: ["Botanical Garden", "Park Bench Reading"],
        status: "pending",
        energyCost: 8,
      },
    ],
    evening: [
      {
        id: "e1-d0-u2",
        title: "Early Dinner at Cozy Bistro",
        time: "6:00 - 7:30 PM",
        tags: ["Gastronomy", "Relaxation"],
        alternatives: ["Room Service", "Hotel Dining"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "e2-d0-u2",
        title: "Evening Tea & Book Reading",
        time: "8:00 - 9:00 PM",
        tags: ["Relaxation", "Indoor", "Calm"],
        alternatives: ["Movie in Room", "Spa Session"],
        status: "pending",
        energyCost: 3,
      },
    ],
  },
  "day1": {
    morning: [
      {
        id: "m1-d1-u2",
        title: "Late Breakfast & Coffee",
        time: "9:00 - 10:00 AM",
        tags: ["Gastronomy", "Relaxation"],
        alternatives: ["Continental Breakfast", "Brunch"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m2-d1-u2",
        title: "Visit to Small Art Gallery",
        time: "10:30 - 11:30 AM",
        tags: ["Culture", "Art", "Indoor"],
        alternatives: ["Craft Workshop Visit", "Antique Shop Tour"],
        status: "pending",
        energyCost: 8,
      },
      {
        id: "m3-d1-u2",
        title: "Coffee at Historic Café",
        time: "12:00 - 1:00 PM",
        tags: ["Gastronomy", "Relaxation", "Culture"],
        alternatives: ["Tea House", "Pastry Shop"],
        status: "pending",
        energyCost: 5,
      },
    ],
    afternoon: [
      {
        id: "a1-d1-u2",
        title: "Spa & Wellness Session",
        time: "2:00 - 3:30 PM",
        tags: ["Wellness", "Relaxation", "Indoor"],
        alternatives: ["Massage", "Sauna"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "a2-d1-u2",
        title: "Afternoon Rest at Hotel",
        time: "4:00 - 5:00 PM",
        tags: ["Relaxation", "Rest"],
        alternatives: ["Nap", "Reading Time"],
        status: "pending",
        energyCost: 0,
      },
    ],
    evening: [
      {
        id: "e1-d1-u2",
        title: "Light Dinner",
        time: "6:30 - 7:30 PM",
        tags: ["Gastronomy", "Healthy"],
        alternatives: ["Salad Bar", "Vegetarian Restaurant"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "e2-d1-u2",
        title: "Quiet Evening Walk",
        time: "8:00 - 8:45 PM",
        tags: ["Walking", "Nature", "Calm"],
        alternatives: ["Riverside Stroll", "Garden Visit"],
        status: "pending",
        energyCost: 5,
      },
    ],
  },
  "day2": {
    morning: [
      {
        id: "m1-d2-u2",
        title: "Meditation & Mindfulness",
        time: "8:00 - 9:00 AM",
        tags: ["Wellness", "Relaxation"],
        alternatives: ["Breathing Exercises", "Yoga"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m2-d2-u2",
        title: "Brunch at Garden Café",
        time: "10:00 - 11:30 AM",
        tags: ["Gastronomy", "Nature"],
        alternatives: ["Rooftop Café", "Terrace Dining"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m3-d2-u2",
        title: "Visit to Botanical Garden",
        time: "12:00 - 1:30 PM",
        tags: ["Nature", "Walking", "Calm"],
        alternatives: ["Greenhouse Tour", "Park Visit"],
        status: "pending",
        energyCost: 8,
      },
    ],
    afternoon: [
      {
        id: "a1-d2-u2",
        title: "Traditional Tea Ceremony",
        time: "2:30 - 3:30 PM",
        tags: ["Culture", "Relaxation"],
        alternatives: ["Coffee Tasting", "Herbal Tea Workshop"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "a2-d2-u2",
        title: "Pottery or Art Workshop",
        time: "4:00 - 5:30 PM",
        tags: ["Culture", "Creative", "Indoor"],
        alternatives: ["Painting Class", "Calligraphy"],
        status: "pending",
        energyCost: 10,
      },
    ],
    evening: [
      {
        id: "e1-d2-u2",
        title: "Dinner at Vegetarian Restaurant",
        time: "6:30 - 8:00 PM",
        tags: ["Gastronomy", "Healthy"],
        alternatives: ["Organic Food", "Farm-to-Table"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "e2-d2-u2",
        title: "Evening Spa Treatment",
        time: "8:30 - 9:30 PM",
        tags: ["Wellness", "Relaxation"],
        alternatives: ["Aromatherapy", "Foot Massage"],
        status: "pending",
        energyCost: 3,
      },
    ],
  },
  "day3": {
    morning: [
      {
        id: "m1-d3-u2",
        title: "Slow Morning Breakfast",
        time: "9:00 - 10:30 AM",
        tags: ["Gastronomy", "Relaxation"],
        alternatives: ["Room Service", "Hotel Breakfast"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m2-d3-u2",
        title: "Visit to Local Library",
        time: "11:00 AM - 12:00 PM",
        tags: ["Culture", "Indoor", "Quiet"],
        alternatives: ["Bookstore Visit", "Reading Room"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m3-d3-u2",
        title: "Light Lunch at Café",
        time: "12:30 - 1:30 PM",
        tags: ["Gastronomy", "Relaxation"],
        alternatives: ["Soup & Salad", "Sandwich Shop"],
        status: "pending",
        energyCost: 5,
      },
    ],
    afternoon: [
      {
        id: "a1-d3-u2",
        title: "Afternoon Nap or Rest",
        time: "2:00 - 3:30 PM",
        tags: ["Rest", "Relaxation"],
        alternatives: ["Quiet Reading", "Meditation"],
        status: "pending",
        energyCost: 0,
      },
      {
        id: "a2-d3-u2",
        title: "Gentle Walk in Old Town",
        time: "4:00 - 5:00 PM",
        tags: ["Walking", "Culture", "Calm"],
        alternatives: ["Window Shopping", "People Watching"],
        status: "pending",
        energyCost: 8,
      },
    ],
    evening: [
      {
        id: "e1-d3-u2",
        title: "Casual Dinner",
        time: "6:00 - 7:00 PM",
        tags: ["Gastronomy"],
        alternatives: ["Bistro", "Small Restaurant"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "e2-d3-u2",
        title: "Classical Music Concert",
        time: "8:00 - 9:30 PM",
        tags: ["Culture", "Music", "Indoor"],
        alternatives: ["Jazz Club", "Piano Bar"],
        status: "pending",
        energyCost: 8,
      },
    ],
  },
  "day4": {
    morning: [
      {
        id: "m1-d4-u2",
        title: "Morning Stretching",
        time: "8:30 - 9:15 AM",
        tags: ["Wellness", "Relaxation"],
        alternatives: ["Light Yoga", "Walking"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m2-d4-u2",
        title: "Breakfast at Pastry Shop",
        time: "9:30 - 10:30 AM",
        tags: ["Gastronomy"],
        alternatives: ["Bakery", "Café"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m3-d4-u2",
        title: "Visit to Small Museum",
        time: "11:00 AM - 12:30 PM",
        tags: ["Culture", "Indoor"],
        alternatives: ["Historical House", "Exhibition"],
        status: "pending",
        energyCost: 8,
      },
    ],
    afternoon: [
      {
        id: "a1-d4-u2",
        title: "Lunch & Wine Tasting",
        time: "1:00 - 2:30 PM",
        tags: ["Gastronomy", "Culture"],
        alternatives: ["Restaurant Lunch", "Food Tour"],
        status: "pending",
        energyCost: 8,
      },
      {
        id: "a2-d4-u2",
        title: "Lakeside or Riverside Relaxation",
        time: "3:00 - 4:30 PM",
        tags: ["Nature", "Relaxation"],
        alternatives: ["Park Bench", "Outdoor Café"],
        status: "pending",
        energyCost: 5,
      },
    ],
    evening: [
      {
        id: "e1-d4-u2",
        title: "Dinner at Traditional Restaurant",
        time: "6:00 - 7:30 PM",
        tags: ["Gastronomy", "Culture"],
        alternatives: ["Local Cuisine", "Family Restaurant"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "e2-d4-u2",
        title: "Evening Herbal Tea & Relaxation",
        time: "8:00 - 9:00 PM",
        tags: ["Wellness", "Relaxation"],
        alternatives: ["Spa Visit", "Reading Time"],
        status: "pending",
        energyCost: 3,
      },
    ],
  },
  "day5": {
    morning: [
      {
        id: "m1-d5-u2",
        title: "Late Morning Breakfast",
        time: "9:30 - 10:30 AM",
        tags: ["Gastronomy", "Relaxation"],
        alternatives: ["Brunch", "Hotel Dining"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "m2-d5-u2",
        title: "Visit to Farmers Market",
        time: "11:00 AM - 12:00 PM",
        tags: ["Culture", "Shopping", "Local"],
        alternatives: ["Craft Market", "Flea Market"],
        status: "pending",
        energyCost: 8,
      },
      {
        id: "m3-d5-u2",
        title: "Light Snack at Market Café",
        time: "12:15 - 1:00 PM",
        tags: ["Gastronomy", "Local"],
        alternatives: ["Food Stall", "Café"],
        status: "pending",
        energyCost: 5,
      },
    ],
    afternoon: [
      {
        id: "a1-d5-u2",
        title: "Final Spa Treatment",
        time: "2:00 - 3:30 PM",
        tags: ["Wellness", "Relaxation"],
        alternatives: ["Massage", "Facial"],
        status: "pending",
        energyCost: 5,
      },
      {
        id: "a2-d5-u2",
        title: "Packing & Rest",
        time: "4:00 - 5:30 PM",
        tags: ["Rest", "Preparation"],
        alternatives: ["Organize Luggage", "Final Souvenir Shopping"],
        status: "pending",
        energyCost: 5,
      },
    ],
    evening: [
      {
        id: "e1-d5-u2",
        title: "Farewell Dinner",
        time: "6:30 - 8:00 PM",
        tags: ["Gastronomy", "Special"],
        alternatives: ["Fine Dining", "Favorite Restaurant"],
        status: "pending",
        energyCost: 8,
      },
      {
        id: "e2-d5-u2",
        title: "Quiet Evening Reflection",
        time: "8:30 - 9:30 PM",
        tags: ["Relaxation", "Reflection"],
        alternatives: ["Journaling", "Photo Review"],
        status: "pending",
        energyCost: 3,
      },
    ],
  },
};

export default function DailyPlanScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasTripCreated, setHasTripCreated] = useState(false);
  const [tripStartDate, setTripStartDate] = useState<Date | null>(null);
  const [tripEndDate, setTripEndDate] = useState<Date | null>(null);
  const [currentEnergy, setCurrentEnergy] = useState(100); // Start with 100% energy
  const [energyLevelsPerDay, setEnergyLevelsPerDay] = useState<Record<string, number>>({}); // Energy per date
  const [currentUser, setCurrentUser] = useState<'user1' | 'user2'>('user1');
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 40;

  // Select activities database based on current user
  const activitiesDatabase = currentUser === 'user1' ? activitiesDatabaseUser1 : activitiesDatabaseUser2;

  // Load current user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(user as 'user1' | 'user2');
      }
    };
    loadUser();
  }, []);

  // Check if trip has been created and load trip dates
  useFocusEffect(
    React.useCallback(() => {
      const checkTripStatus = async () => {
        const tripCreated = await AsyncStorage.getItem('tripCreated');
        const tripData = await AsyncStorage.getItem('currentTrip');
        const user = await AsyncStorage.getItem('currentUser');

        if (user) {
          setCurrentUser(user as 'user1' | 'user2');
        }

        console.log('Daily Plan - tripCreated:', tripCreated);
        console.log('Daily Plan - tripData:', tripData);

        if (tripCreated === 'true' && tripData) {
          setHasTripCreated(true);
          const trip = JSON.parse(tripData);
          const startDate = new Date(trip.start_date);
          const endDate = new Date(trip.end_date);
          setTripStartDate(startDate);
          setTripEndDate(endDate);
          setCurrentDate(startDate);

          // Load saved activities and energy levels per day if they exist
          const savedActivities = await AsyncStorage.getItem('dailyPlanActivities');
          const savedEnergyLevels = await AsyncStorage.getItem('energyLevelsPerDay');

          if (savedActivities) {
            setAllActivities(JSON.parse(savedActivities));
          }

          if (savedEnergyLevels) {
            const energyData = JSON.parse(savedEnergyLevels);
            setEnergyLevelsPerDay(energyData);
            // Set current energy based on today's date
            const todayKey = formatDateKey(new Date());
            setCurrentEnergy(energyData[todayKey] || 100);
          }
        } else {
          // Reset everything when no trip exists
          setHasTripCreated(false);
          setTripStartDate(null);
          setTripEndDate(null);
          setCurrentDate(new Date());
          setCurrentEnergy(100);
          setEnergyLevelsPerDay({});
          setAllActivities(activitiesDatabase);
        }
      };
      checkTripStatus();
    }, [activitiesDatabase])
  );

  const getDateKey = (date: Date) => {
    if (!tripStartDate || !hasTripCreated) {
      return "day0";
    }

    // Calculate day offset from trip start date
    const diffTime = date.getTime() - tripStartDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // We have activities for day0-day5 (6 days)
    // For longer trips, cycle through these days
    const availableDays = 6;
    const cyclicDay = diffDays % availableDays;

    return "day" + cyclicDay;
  };

  // Helper to format date as YYYY-MM-DD for energy tracking
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  };

  // Check if date is in the future
  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const [allActivities, setAllActivities] =
    useState<Record<string, DayActivities>>(activitiesDatabase);

  const currentDateKey = getDateKey(currentDate);
  const activities = allActivities[currentDateKey];
  // Only show activities if trip has been created
  const hasActivities = hasTripCreated && !!activities;
  const [selectedActivity, setSelectedActivity] = useState<{
    timeOfDay: TimeOfDay;
    activityId: string;
  } | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);

    // Load energy for the new date
    const dateKey = formatDateKey(newDate);
    setCurrentEnergy(energyLevelsPerDay[dateKey] || 100);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);

    // Load energy for the new date
    const dateKey = formatDateKey(newDate);
    setCurrentEnergy(energyLevelsPerDay[dateKey] || 100);
  };

  const handleEditClick = (timeOfDay: TimeOfDay, activityId: string) => {
    setSelectedActivity({ timeOfDay, activityId });
    setShowActionModal(true);
  };

  const handleStatusChange = (status: ActivityStatus) => {
    if (!selectedActivity) return;

    // Prevent completing activities on future dates
    if (status === "completed" && isFutureDate(currentDate)) {
      Alert.alert(
        "Cannot Complete",
        "You cannot complete activities on future dates. Only today's activities can be completed."
      );
      setShowActionModal(false);
      setSelectedActivity(null);
      return;
    }

    // Find the activity to get its energy cost
    const activity = allActivities[currentDateKey][selectedActivity.timeOfDay].find(
      (a) => a.id === selectedActivity.activityId
    );

    if (activity) {
      const previousStatus = activity.status;

      // Calculate energy change
      let energyChange = 0;

      // If changing from pending to completed, consume energy
      if (previousStatus === "pending" && status === "completed") {
        energyChange = -activity.energyCost;
      }
      // If changing from pending to skipped, no energy change
      else if (previousStatus === "pending" && status === "skipped") {
        energyChange = 0;
      }
      // If changing from completed back to pending, restore energy
      else if (previousStatus === "completed" && status === "pending") {
        energyChange = activity.energyCost;
      }
      // If changing from completed to skipped, restore energy
      else if (previousStatus === "completed" && status === "skipped") {
        energyChange = activity.energyCost;
      }
      // If changing from skipped to completed, consume energy
      else if (previousStatus === "skipped" && status === "completed") {
        energyChange = -activity.energyCost;
      }

      // Update energy for the current date
      const dateKey = formatDateKey(currentDate);
      const currentDateEnergy = energyLevelsPerDay[dateKey] || 100;
      const newEnergy = Math.max(0, Math.min(100, currentDateEnergy + energyChange));

      setEnergyLevelsPerDay(prev => ({
        ...prev,
        [dateKey]: newEnergy
      }));

      // Update current energy display
      setCurrentEnergy(newEnergy);
    }

    setAllActivities((prev) => {
      const updatedDayActivities = {
        ...prev[currentDateKey],
        [selectedActivity.timeOfDay]: prev[currentDateKey][
          selectedActivity.timeOfDay
        ].map((activity) =>
          activity.id === selectedActivity.activityId
            ? { ...activity, status }
            : activity,
        ),
      };

      return {
        ...prev,
        [currentDateKey]: updatedDayActivities,
      };
    });

    setShowActionModal(false);
    setSelectedActivity(null);
  };

  const getEnergyLevel = () => {
    return Math.max(0, Math.min(100, currentEnergy)); // Clamp between 0-100
  };

  const handleUpdatePlan = async () => {
    try {
      // Save current activities state and energy levels per day
      await AsyncStorage.setItem('dailyPlanActivities', JSON.stringify(allActivities));
      await AsyncStorage.setItem('energyLevelsPerDay', JSON.stringify(energyLevelsPerDay));

      Alert.alert(
        "Plan Updated",
        "Your daily plan has been saved!\nCurrent Energy: " + Math.round(currentEnergy) + "%"
      );
    } catch (error) {
      console.error('Error saving plan:', error);
      Alert.alert("Error", "Failed to save your plan");
    }
  };

  const renderActivity = (activity: Activity, timeOfDay: TimeOfDay) => {
    const isCompleted = activity.status === "completed";
    const isSkipped = activity.status === "skipped";

    return (
      <View
        key={activity.id}
        style={[
          styles.activityCard,
          { width: cardWidth },
          isCompleted && styles.activityCompleted,
          isSkipped && styles.activitySkipped,
        ]}
      >
        <View style={styles.activityHeader}>
          <Text
            style={[
              styles.activityTitle,
              (isCompleted || isSkipped) && styles.activityTitleDone,
            ]}
          >
            {activity.title}
          </Text>
          <Pressable
            onPress={() => handleEditClick(timeOfDay, activity.id)}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={20} color="#0D9488" />
          </Pressable>
        </View>

        <Text style={styles.activityTime}>{activity.time}</Text>

        <View style={styles.tagsContainer}>
          {activity.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {activity.status !== "pending" && (
          <View style={styles.statusBadge}>
            <View style={styles.statusContent}>
              <Ionicons
                name={
                  activity.status === "completed"
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={16}
                color={activity.status === "completed" ? "#059669" : "#DC2626"}
              />
              <Text style={styles.statusText}>
                {activity.status === "completed" ? "Completed" : "Skipped"}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.alternativesLabel}>Alternative Activities:</Text>
        <View style={styles.alternativesContainer}>
          {activity.alternatives.map((alt, index) => (
            <View key={index} style={styles.alternativeChip}>
              <Text style={styles.alternativeText}>{alt}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderActivitySlider = (
    activities: Activity[],
    timeOfDay: TimeOfDay,
    icon: string,
    iconColor: string,
    title: string,
  ) => {
    return (
      <View style={styles.timeSection}>
        <View style={styles.timeSectionHeader}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
          <Text style={styles.timeSectionTitle}>{title}</Text>
          <View style={styles.activityCounter}>
            <Text style={styles.activityCounterText}>{activities.length}</Text>
          </View>
        </View>
        <View style={styles.activitiesContainer}>
          {activities.map((item) => renderActivity(item, timeOfDay))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BioSync Travel</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.pageTitle}>Your Daily Plan</Text>

        <View style={styles.dateSelector}>
          <Pressable
            onPress={handlePreviousDay}
            style={styles.dateArrow}
          >
            <Text style={styles.arrowText}>◀</Text>
          </Pressable>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
            {tripStartDate && tripEndDate && (
              <Text style={styles.tripRangeText}>
                Trip: {tripStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {tripEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
            )}
          </View>
          <Pressable
            onPress={handleNextDay}
            style={styles.dateArrow}
          >
            <Text style={styles.arrowText}>▶</Text>
          </Pressable>
        </View>

        {/* Only show energy section for today's date */}
        {isToday(currentDate) && (
          <View style={styles.energySection}>
            <View style={styles.energyHeader}>
              <View style={styles.energyLabelContainer}>
                <Ionicons name="stats-chart" size={20} color="#0D9488" />
                <Text style={styles.energyLabel}>Current Energy Level</Text>
              </View>
              <View style={styles.energyBadge}>
                <Text style={styles.energyPercentage}>{getEnergyLevel()}%</Text>
              </View>
            </View>
            <View style={styles.energyBar}>
              <View
                style={[styles.energyFill, { width: (getEnergyLevel() + '%') as any }]}
              />
            </View>
            <View style={styles.energyLabels}>
              <Text style={styles.energyLabelText}>Low</Text>
              <Text style={styles.energyLabelText}>Medium</Text>
              <Text style={styles.energyLabelText}>High</Text>
            </View>
          </View>
        )}

        {hasActivities ? (
          <>
            {renderActivitySlider(
              activities.morning,
              "morning",
              "sunny",
              "#F59E0B",
              "Morning",
            )}

            {renderActivitySlider(
              activities.afternoon,
              "afternoon",
              "partly-sunny",
              "#FB923C",
              "Afternoon",
            )}

            {renderActivitySlider(
              activities.evening,
              "evening",
              "moon",
              "#6366F1",
              "Evening",
            )}
          </>
        ) : (
          <View style={styles.noActivitiesContainer}>
            <Ionicons name="airplane-outline" size={64} color="#94A3B8" />
            <Text style={styles.noActivitiesTitle}>
              No Trip Planned Yet
            </Text>
            <Text style={styles.noActivitiesText}>
              Create your first trip to see your personalized daily itinerary with activities tailored to your energy levels!
            </Text>
          </View>
        )}

        {hasActivities && (
          <Pressable style={styles.updateButton} onPress={handleUpdatePlan}>
            <Text style={styles.updateButtonText}>Update Plan</Text>
          </Pressable>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowActionModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="calendar" size={28} color="#0D9488" />
              </View>
              <Text style={styles.modalTitle}>Update Activity Status</Text>
              <Text style={styles.modalSubtitle}>
                Choose how you want to proceed with this activity
              </Text>
            </View>

            <View style={styles.modalButtonsContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalButtonCompleted,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => handleStatusChange("completed")}
              >
                <View style={styles.modalButtonIconWrapper}>
                  <Ionicons name="checkmark-circle" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.modalButtonContent}>
                  <Text style={styles.modalButtonTitle}>Completed</Text>
                  <Text style={styles.modalButtonDescription}>
                    Mark this activity as done
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalButtonSkipped,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => handleStatusChange("skipped")}
              >
                <View style={styles.modalButtonIconWrapper}>
                  <Ionicons name="close-circle" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.modalButtonContent}>
                  <Text style={styles.modalButtonTitle}>Skip</Text>
                  <Text style={styles.modalButtonDescription}>
                    Skip this activity for now
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalButtonReset,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={() => handleStatusChange("pending")}
              >
                <View style={styles.modalButtonIconWrapper}>
                  <Ionicons name="refresh-circle" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.modalButtonContent}>
                  <Text style={styles.modalButtonTitle}>Reset</Text>
                  <Text style={styles.modalButtonDescription}>
                    Reset to pending status
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.modalButtonCancel,
                pressed && styles.modalButtonCancelPressed,
              ]}
              onPress={() => setShowActionModal(false)}
            >
              <Text style={styles.modalButtonCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  header: {
    backgroundColor: "#0D9488",
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D9488",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  dateArrow: {
    backgroundColor: "#0D9488",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D9488",
  },
  tripRangeText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  energySection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  energyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  energyLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  energyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#11181C",
  },
  energyBadge: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  energyPercentage: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  energyBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  energyFill: {
    height: "100%",
    backgroundColor: "#0D9488",
  },
  energyLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  energyLabelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  timeSection: {
    marginBottom: 24,
  },
  timeSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  timeSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D9488",
    flex: 1,
  },
  activityCounter: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityCounterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D9488",
  },
  activitiesContainer: {
    paddingLeft: 20,
    gap: 12,
  },
  sliderContainer: {
    paddingLeft: 20,
    gap: 12,
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityCompleted: {
    backgroundColor: "#D1FAE5",
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  activitySkipped: {
    backgroundColor: "#FEE2E2",
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
    opacity: 0.7,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
    flex: 1,
  },
  activityTitleDone: {
    color: "#6B7280",
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 20,
  },
  activityTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#0D9488",
    fontWeight: "500",
  },
  statusBadge: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  alternativesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  alternativesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  alternativeChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  alternativeText: {
    fontSize: 13,
    color: "#6B7280",
  },
  updateButton: {
    backgroundColor: "#0D9488",
    marginHorizontal: 20,
    marginVertical: 24,
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#E0F2F1",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#11181C",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  modalButtonCompleted: {
    backgroundColor: "#10B981",
  },
  modalButtonSkipped: {
    backgroundColor: "#EF4444",
  },
  modalButtonReset: {
    backgroundColor: "#6B7280",
  },
  modalButtonIconWrapper: {
    marginRight: 16,
  },
  modalButtonContent: {
    flex: 1,
  },
  modalButtonTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalButtonDescription: {
    color: "#FFFFFF",
    fontSize: 13,
    opacity: 0.9,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonCancel: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  modalButtonCancelPressed: {
    backgroundColor: "#E5E7EB",
  },
  modalButtonCancelText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  noActivitiesContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noActivitiesTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  noActivitiesText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
});



