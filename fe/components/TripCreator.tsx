// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   getAllTemplates,
//   TripTemplate,
// } from "@/lib/tripTemplateApi";

// interface TripCreatorProps {
//   onTripSelected?: (template: TripTemplate) => void;
// }

// export default function TripCreator({
//   onTripSelected,
// }: TripCreatorProps) {
//   const [loading, setLoading] = useState(false);
//   const [templates, setTemplates] = useState<TripTemplate[]>([]);
//   const [loadingTemplates, setLoadingTemplates] = useState(true);

//   useEffect(() => {
//     loadTemplates();
//   }, []);

//   const loadTemplates = async () => {
//     try {
//       const data = await getAllTemplates();
//       setTemplates(data);
//     } catch (error) {
//       console.error("Error loading templates:", error);
//     } finally {
//       setLoadingTemplates(false);
//     }
//   };

//   const handleCreateTrip = async (
//     mood: "sad" | "energetic" | "stressed",
//     energyLevel: "low" | "high",
//   ) => {
//     try {
//       setLoading(true);

//       // Znajdź szablon dla wybranego nastroju
//       const template = templates.find((t) => t.mood_target === mood);

//       if (!template) {
//         Alert.alert("Error", "No route found for the selected mood.");
//         return;
//       }

//       // Wywołaj callback z wybranym szablonem
//       onTripSelected?.(template);
//     } catch (error) {
//       console.error("Error selecting trip:", error);
//       Alert.alert("Error", "Failed to select route.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMoodInfo = (mood: "sad" | "energetic" | "stressed") => {
//     const info = {
//       sad: {
//         icon: "cloud-outline" as const,
//         color: "#3B82F6",
//         bgColor: "#DBEAFE",
//         title: "I need comfort",
//         desc: "Calm places to lift your mood",
//       },
//       energetic: {
//         icon: "flash-outline" as const,
//         color: "#F59E0B",
//         bgColor: "#FEF3C7",
//         title: "I have lots of energy!",
//         desc: "Active city adventure",
//       },
//       stressed: {
//         icon: "leaf-outline" as const,
//         color: "#10B981",
//         bgColor: "#D1FAE5",
//         title: "I’m stressed",
//         desc: "Relax in nature and greenery",
//       },
//     };
//     return info[mood];
//   };

//   const getTemplateForMood = (mood: "sad" | "energetic" | "stressed") => {
//     return templates.find((t) => t.mood_target === mood);
//   };

//   if (loading || loadingTemplates) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0D9488" />
//         <Text style={styles.loadingText}>
//           {loading ? "Creating your route..." : "Loading options..."}
//         </Text>
//       </View>
//     );
//   }

//   const moodOptions: ("sad" | "energetic" | "stressed")[] = [
//     "sad",
//     "energetic",
//     "stressed",
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Ionicons name="sparkles" size={24} color="#0D9488" />
//         <Text style={styles.title}>How are you feeling today?</Text>
//       </View>
//       <Text style={styles.subtitle}>
//         Choose your mood and we’ll create the perfect route for you!
//       </Text>

//       <View style={styles.optionsContainer}>
//         {moodOptions.map((mood) => {
//           const info = getMoodInfo(mood);
//           const template = getTemplateForMood(mood);
//           const energyLevel = mood === "energetic" ? "high" : "low";

//           return (
//             <Pressable
//               key={mood}
//               style={styles.optionCard}
//               onPress={() => handleCreateTrip(mood, energyLevel)}
//             >
//               <View
//                 style={[styles.iconCircle, { backgroundColor: info.bgColor }]}
//               >
//                 <Ionicons name={info.icon} size={32} color={info.color} />
//               </View>
//               <View style={styles.optionContent}>
//                 <Text style={styles.optionTitle}>{info.title}</Text>
//                 <Text style={styles.optionDesc}>{info.desc}</Text>
//                 {template && (
//                   <View style={styles.templateInfo}>
//                     <Ionicons name="map-outline" size={12} color="#6B7280" />
//                     <Text style={styles.templateName}>{template.name}</Text>
//                   </View>
//                 )}
//               </View>
//             </Pressable>
//           );
//         })}
//       </View>

//       {templates.length === 0 && (
//         <View style={styles.noTemplates}>
//           <Text style={styles.noTemplatesText}>
//             No route templates available. Run seed_templates.sql in the
//             database.
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 20,
//     marginHorizontal: 20,
//     marginVertical: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#11181C",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: "#0D9488",
//     textAlign: "center",
//   },
//   optionsContainer: {
//     gap: 12,
//   },
//   optionCard: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 12,
//     borderWidth: 2,
//     borderColor: "transparent",
//   },
//   iconCircle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   optionContent: {
//     flex: 1,
//     gap: 4,
//   },
//   optionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#11181C",
//   },
//   optionDesc: {
//     fontSize: 12,
//     color: "#6B7280",
//     lineHeight: 16,
//   },
//   templateInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     marginTop: 4,
//   },
//   templateName: {
//     fontSize: 11,
//     color: "#6B7280",
//     fontStyle: "italic",
//   },
//   noTemplates: {
//     marginTop: 12,
//     padding: 16,
//     backgroundColor: "#FEF3C7",
//     borderRadius: 8,
//   },
//   noTemplatesText: {
//     fontSize: 13,
//     color: "#92400E",
//     textAlign: "center",
//   },
// });
