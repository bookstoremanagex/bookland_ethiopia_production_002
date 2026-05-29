"use client";

import React, { useState, useEffect } from "react";
import { 
    Palette, 
    Save, 
    RefreshCw, 
    Loader2, 
    CheckCircle2, 
    Sparkles,
    Sliders,
    Eye,
    Bell,
    ClipboardList,
    MessageSquare
} from "lucide-react";
import { getSettings, updateSettings } from "@/app/actions/settings-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PresetColor {
    name: string;
    hex: string;
    description: string;
}

const PRESET_COLORS: PresetColor[] = [
    { name: "Emerald Mint", hex: "#408A71", description: "Default Bookstore Green" },
    { name: "Royal Indigo", hex: "#3b82f6", description: "Modern Corporate Blue" },
    { name: "Deep Amethyst", hex: "#8b5cf6", description: "Premium Creative Purple" },
    { name: "Crimson Rose", hex: "#f43f5e", description: "Energetic Bold Pink" },
    { name: "Amber Ochre", hex: "#f59e0b", description: "Warm Golden Sunlight" },
    { name: "Classic Slate", hex: "#475569", description: "Professional Minimalist Gray" }
];

// Helper to darken a color by a certain amount to create a secondary color
function getDarkerShade(hex: string, amount = 30): string {
    let num = parseInt(hex.replace("#", ""), 16);
    let R = (num >> 16) - amount;
    let G = ((num >> 8) & 0x00FF) - amount;
    let B = (num & 0x0000FF) - amount;
    
    R = R < 0 ? 0 : R;
    G = G < 0 ? 0 : G;
    B = B < 0 ? 0 : B;
    
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

export default function ThemeSettingsPage() {
    const [primaryColor, setPrimaryColor] = useState("#408A71");
    const [badgeColor, setBadgeColor] = useState("#059669");
    const [toastBgColor, setToastBgColor] = useState("#FFFFFF");
    const [toastTextColor, setToastTextColor] = useState("#1E293B");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load initial color from local storage or server settings on mount
    useEffect(() => {
        const fetchInitialSettings = async () => {
            setLoading(true);
            
            // Check local storage first for immediate load
            const localColor = localStorage.getItem("primarycolor");
            if (localColor) {
                setPrimaryColor(localColor);
            }
            const localBadge = localStorage.getItem("badgecolor");
            if (localBadge) {
                setBadgeColor(localBadge);
            }
            const localToastBg = localStorage.getItem("toastbgcolor");
            if (localToastBg) {
                setToastBgColor(localToastBg);
            }
            const localToastText = localStorage.getItem("toasttextcolor");
            if (localToastText) {
                setToastTextColor(localToastText);
            }
            
            // Sync with DB
            const res = await getSettings();
            if (res.success && res.data) {
                const dbColor = res.data.primaryColor;
                setPrimaryColor(dbColor);
                // Also update local storage if mismatch
                if (localColor !== dbColor) {
                    localStorage.setItem("primarycolor", dbColor);
                    const secondary = getDarkerShade(dbColor);
                    localStorage.setItem("secondarycolor", secondary);
                    document.documentElement.style.setProperty("--primarycolor", dbColor);
                    document.documentElement.style.setProperty("--secondarycolor", secondary);
                }

                const dbBadge = res.data.badgeColor || "#059669";
                setBadgeColor(dbBadge);
                if (localBadge !== dbBadge) {
                    localStorage.setItem("badgecolor", dbBadge);
                    document.documentElement.style.setProperty("--badgecolor", dbBadge);
                }

                const dbToastBg = res.data.toastBgColor || "#FFFFFF";
                setToastBgColor(dbToastBg);
                if (localToastBg !== dbToastBg) {
                    localStorage.setItem("toastbgcolor", dbToastBg);
                    document.documentElement.style.setProperty("--toastbg", dbToastBg);
                }

                const dbToastText = res.data.toastTextColor || "#1E293B";
                setToastTextColor(dbToastText);
                if (localToastText !== dbToastText) {
                    localStorage.setItem("toasttextcolor", dbToastText);
                    document.documentElement.style.setProperty("--toasttext", dbToastText);
                }
            }
            setLoading(false);
        };
        fetchInitialSettings();
    }, []);

    // Apply color changes dynamically in real-time
    const handleColorChange = (hex: string) => {
        setPrimaryColor(hex);
        
        // Instant visual preview and local cache
        localStorage.setItem("primarycolor", hex);
        const secondary = getDarkerShade(hex);
        localStorage.setItem("secondarycolor", secondary);
        
        document.documentElement.style.setProperty("--primarycolor", hex);
        document.documentElement.style.setProperty("--secondarycolor", secondary);
    };

    // Handle badge color changes
    const handleBadgeColorChange = (hex: string) => {
        setBadgeColor(hex);
        localStorage.setItem("badgecolor", hex);
        document.documentElement.style.setProperty("--badgecolor", hex);
    };

    // Handle toast color changes
    const handleToastBgColorChange = (hex: string) => {
        setToastBgColor(hex);
        localStorage.setItem("toastbgcolor", hex);
        document.documentElement.style.setProperty("--toastbg", hex);
    };

    const handleToastTextColorChange = (hex: string) => {
        setToastTextColor(hex);
        localStorage.setItem("toasttextcolor", hex);
        document.documentElement.style.setProperty("--toasttext", hex);
    };

    // Save customized theme to the database
    const handleSaveSettings = async () => {
        setSaving(true);
        const res = await updateSettings(primaryColor, badgeColor, toastBgColor, toastTextColor);
        if (res.success) {
            toast.success("Theme settings persisted successfully!");
        } else {
            toast.error(res.error || "Failed to persist theme settings.");
        }
        setSaving(false);
    };

    // Reset to initial system default
    const handleResetToDefault = () => {
        handleColorChange("#408A71");
        handleBadgeColorChange("#059669");
        handleToastBgColorChange("#FFFFFF");
        handleToastTextColorChange("#1E293B");
        toast.info("Theme color reset to default Emerald Mint.");
    };

    if (loading) {
        return (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 text-primarycolor animate-spin" />
                <span className="font-bold text-secondarycolor">Loading theme settings...</span>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-top-3 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[2rem] border-2 border-primarycolor/10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border border-primarycolor/20 shrink-0">
                        <Palette className="size-7" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primarycolor/60">System Configuration</span>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                            Theme Customization
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline"
                        onClick={handleResetToDefault}
                        className="h-11 px-5 rounded-xl font-bold gap-2 text-xs uppercase tracking-wider border-2 hover:bg-slate-50 transition-all"
                    >
                        <RefreshCw className="size-3.5" /> Reset Default
                    </Button>
                    <Button 
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="h-11 px-6 rounded-xl bg-primarycolor hover:bg-secondarycolor text-white font-black gap-2 text-xs uppercase tracking-widest shadow-md shadow-primarycolor/15 transition-all"
                    >
                        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        Save Theme
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left panel - Theme control (65%) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Preset Gallery */}
                    <div className="bg-white rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-primarycolor/5 pb-4">
                            <Sparkles className="size-5 text-primarycolor" />
                            <h3 className="text-sm font-black text-secondarycolor uppercase tracking-wider">
                                Curated Aesthetic Presets
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PRESET_COLORS.map((preset) => {
                                const isSelected = primaryColor.toLowerCase() === preset.hex.toLowerCase();
                                return (
                                    <button
                                        key={preset.hex}
                                        onClick={() => handleColorChange(preset.hex)}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${
                                            isSelected 
                                                ? "border-primarycolor bg-primarycolor/5 shadow-md" 
                                                : "border-slate-100 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div 
                                            className="size-10 rounded-xl shrink-0 border border-black/10 shadow-sm"
                                            style={{ backgroundColor: preset.hex }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-secondarycolor truncate">{preset.name}</p>
                                            <p className="text-[10px] font-semibold text-muted-foreground truncate">{preset.description}</p>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className="size-5 text-primarycolor shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div className="bg-white rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-primarycolor/5 pb-4">
                            <Sliders className="size-5 text-primarycolor" />
                            <h3 className="text-sm font-black text-secondarycolor uppercase tracking-wider">
                                Infinite Custom Selector
                            </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border-2 border-dashed border-primarycolor/10 bg-slate-50/30">
                            {/* Visual Picker */}
                            <div className="relative size-24 shrink-0 rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-white flex items-center justify-center cursor-pointer group">
                                <input 
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                                />
                                <div 
                                    className="size-16 rounded-xl border border-black/15 shadow-sm group-hover:scale-105 transition-transform"
                                    style={{ backgroundColor: primaryColor }}
                                />
                            </div>

                            {/* Hex Input Details */}
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <h4 className="font-black text-secondarycolor text-sm uppercase tracking-wide">Select Custom Hue</h4>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Click the canvas block above to launch the standard system color wheel, or copy/type a hex code value directly below:
                                </p>
                                <div className="flex items-center gap-2 max-w-[200px] mx-auto sm:mx-0">
                                    <span className="text-base font-black text-muted-foreground">#</span>
                                    <input 
                                        type="text"
                                        maxLength={6}
                                        value={primaryColor.replace("#", "")}
                                        onChange={(e) => handleColorChange("#" + e.target.value)}
                                        className="h-10 px-3 w-full rounded-lg border-2 border-slate-200 font-mono text-sm font-black uppercase text-secondarycolor focus:border-primarycolor outline-none"
                                        placeholder="408A71"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Badge Count Color Selector */}
                    <div className="bg-white rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-primarycolor/5 pb-4">
                            <Bell className="size-5 text-primarycolor" />
                            <h3 className="text-sm font-black text-secondarycolor uppercase tracking-wider">
                                Badge Count Color
                            </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border-2 border-dashed border-primarycolor/10 bg-slate-50/30">
                            {/* Visual Picker */}
                            <div className="relative size-24 shrink-0 rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-white flex items-center justify-center cursor-pointer group">
                                <input 
                                    type="color"
                                    value={badgeColor}
                                    onChange={(e) => handleBadgeColorChange(e.target.value)}
                                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                                />
                                <div 
                                    className="size-16 rounded-xl border border-black/15 shadow-sm group-hover:scale-105 transition-transform"
                                    style={{ backgroundColor: badgeColor }}
                                />
                            </div>

                            {/* Hex Input Details */}
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <h4 className="font-black text-secondarycolor text-sm uppercase tracking-wide">Badge Notification Hue</h4>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Choose the color for the numeric badge counts displayed next to Notifications and Manage Orders in the sidebar.
                                </p>
                                <div className="flex items-center gap-2 max-w-[200px] mx-auto sm:mx-0">
                                    <span className="text-base font-black text-muted-foreground">#</span>
                                    <input 
                                        type="text"
                                        maxLength={6}
                                        value={badgeColor.replace("#", "")}
                                        onChange={(e) => handleBadgeColorChange("#" + e.target.value)}
                                        className="h-10 px-3 w-full rounded-lg border-2 border-slate-200 font-mono text-sm font-black uppercase text-secondarycolor focus:border-primarycolor outline-none"
                                        placeholder="059669"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Badge Preview */}
                        <div className="p-4 rounded-2xl border-2 border-primarycolor/5 bg-slate-50/50">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-3">Sidebar Preview</span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                                    <Bell className="size-4 text-primarycolor" />
                                    <span className="text-sm font-bold text-foreground">Notifications</span>
                                    <div className="size-6 rounded-full text-white text-[10px] font-black flex items-center justify-center" style={{ backgroundColor: badgeColor }}>
                                        3
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                                    <ClipboardList className="size-4 text-primarycolor" />
                                    <span className="text-sm font-bold text-foreground">Manage Orders</span>
                                    <div className="size-6 rounded-full text-white text-[10px] font-black flex items-center justify-center" style={{ backgroundColor: badgeColor }}>
                                        5
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toast Color Selector */}
                    <div className="bg-white rounded-[2rem] border-2 border-primarycolor/10 p-6 md:p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-primarycolor/5 pb-4">
                            <MessageSquare className="size-5 text-primarycolor" />
                            <h3 className="text-sm font-black text-secondarycolor uppercase tracking-wider">
                                Toast Notification Colors
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Toast Background */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-primarycolor/10 bg-slate-50/30">
                                <div className="relative size-20 shrink-0 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-white flex items-center justify-center cursor-pointer group">
                                    <input 
                                        type="color"
                                        value={toastBgColor}
                                        onChange={(e) => handleToastBgColorChange(e.target.value)}
                                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                                    />
                                    <div 
                                        className="size-12 rounded-lg border border-black/15 shadow-sm group-hover:scale-105 transition-transform"
                                        style={{ backgroundColor: toastBgColor }}
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left space-y-1.5">
                                    <h4 className="font-black text-secondarycolor text-xs uppercase tracking-wide">Background</h4>
                                    <div className="flex items-center gap-2 max-w-[140px] mx-auto sm:mx-0">
                                        <span className="text-xs font-black text-muted-foreground">#</span>
                                        <input 
                                            type="text"
                                            maxLength={6}
                                            value={toastBgColor.replace("#", "")}
                                            onChange={(e) => handleToastBgColorChange("#" + e.target.value)}
                                            className="h-8 px-2 w-full rounded-lg border-2 border-slate-200 font-mono text-xs font-black uppercase text-secondarycolor focus:border-primarycolor outline-none"
                                            placeholder="FFFFFF"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Toast Text */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-primarycolor/10 bg-slate-50/30">
                                <div className="relative size-20 shrink-0 rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-white flex items-center justify-center cursor-pointer group">
                                    <input 
                                        type="color"
                                        value={toastTextColor}
                                        onChange={(e) => handleToastTextColorChange(e.target.value)}
                                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                                    />
                                    <div 
                                        className="size-12 rounded-lg border border-black/15 shadow-sm group-hover:scale-105 transition-transform"
                                        style={{ backgroundColor: toastTextColor }}
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left space-y-1.5">
                                    <h4 className="font-black text-secondarycolor text-xs uppercase tracking-wide">Text Color</h4>
                                    <div className="flex items-center gap-2 max-w-[140px] mx-auto sm:mx-0">
                                        <span className="text-xs font-black text-muted-foreground">#</span>
                                        <input 
                                            type="text"
                                            maxLength={6}
                                            value={toastTextColor.replace("#", "")}
                                            onChange={(e) => handleToastTextColorChange("#" + e.target.value)}
                                            className="h-8 px-2 w-full rounded-lg border-2 border-slate-200 font-mono text-xs font-black uppercase text-secondarycolor focus:border-primarycolor outline-none"
                                            placeholder="1E293B"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Toast Preview */}
                        <div className="p-4 rounded-2xl border-2 border-primarycolor/5 bg-slate-50/50">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-3">Toast Preview</span>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-md border" style={{ backgroundColor: toastBgColor, color: toastTextColor, borderColor: toastBgColor === "#FFFFFF" ? "#E2E8F0" : toastBgColor }}>
                                <MessageSquare className="size-4 shrink-0" style={{ color: toastTextColor }} />
                                <span className="text-sm font-bold flex-1">Toast notification preview</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel - Theme live preview (35%) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] border-2 border-primarycolor/10 p-6 space-y-6 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-primarycolor/5 pb-4">
                            <Eye className="size-5 text-primarycolor" />
                            <h3 className="text-sm font-black text-secondarycolor uppercase tracking-wider">
                                Live Component Canvas
                            </h3>
                        </div>

                        <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
                            Observe how all active buttons, navigation indicators, headers, cards, and interactive layouts update instantly across all screens:
                        </p>

                        {/* Component Previews */}
                        <div className="space-y-4 pt-2">
                            {/* Standard Primary button */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Primary CTA Element</span>
                                <Button className="w-full h-11 bg-primarycolor hover:bg-secondarycolor text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md shadow-primarycolor/10 transition-all">
                                    Primary Action Button
                                </Button>
                            </div>

                            {/* Standard badge */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">System Badge Highlight</span>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primarycolor/10 border border-primarycolor/20 text-[10px] font-black text-primarycolor uppercase tracking-widest rounded-full">
                                    <Sparkles className="size-3" /> Selected Highlight
                                </div>
                            </div>

                            {/* Standard Card Accent */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Dashboard Card Variant</span>
                                <div className="p-4 rounded-2xl border-2 border-primarycolor/10 bg-primarycolor/5 flex items-center justify-between">
                                    <div>
                                        <h5 className="font-black text-xs text-secondarycolor uppercase">Aesthetic Card</h5>
                                        <p className="text-[10px] text-primarycolor font-bold mt-0.5">Styled dynamically</p>
                                    </div>
                                    <div className="size-8 rounded-lg bg-primarycolor text-white flex items-center justify-center">
                                        <Palette className="size-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
