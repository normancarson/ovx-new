/* ============================================================
   OVX - Updated API Layer
   ============================================================ */

const OVX_URL = "https://zlbfxwirukaaakcegnpb.supabase.co"; 
const OVX_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsYmZ4d2lydWthYWFrY2VnbnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDg1NTUsImV4cCI6MjA5OTYyNDU1NX0.aRKzc73Xsu7HACCYAtvjNEFKD9mU1Eq-1r1l47q13SY";

// Standard Supabase Client Initialization
const getDb = () => {
    if (window.supabase && window.supabase.createClient) {
        return window.supabase.createClient(OVX_URL, OVX_KEY);
    }
    return null;
};

const OVX = {
    // Fetch generic content (Testimonials, Stats, etc.)
    async listAll(table) {
        try {
            const db = getDb();
            if (!db) return [];
            const { data, error } = await db.from(table).select("*");
            if (error) throw error;
            return data;
        } catch (e) {
            console.error("Data fetch error:", e);
            return [];
        }
    },

    // Get site settings (Facebook links, phone numbers, etc.)
    async getSettingsMap() {
        const defaults = {
            office_address: "Kigali, Rwanda",
            phone: "+250 788 000 000",
            email: "info@ovx.rw",
            whatsapp: "+250788000000",
            facebook: "https://facebook.com/ovx",
            instagram: "https://instagram.com/ovx"
        };
        try {
            const db = getDb();
            if (!db) return defaults;
            const { data } = await db.from('site_settings').select('*');
            if (data) {
                data.forEach(item => defaults[item.key] = item.value);
            }
            return defaults;
        } catch (e) {
            return defaults;
        }
    },

    async getSetting(key, fallback) {
        const map = await this.getSettingsMap();
        return map[key] || fallback;
    }
};