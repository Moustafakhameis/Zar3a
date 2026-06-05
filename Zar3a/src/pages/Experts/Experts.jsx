import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuMessageSquare, LuStar, LuBadgeCheck, LuX, LuBriefcase,
  LuGraduationCap, LuAward, LuSearch, LuPlus, LuMapPin, LuUpload, LuChevronDown
} from "react-icons/lu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import DualImageUpload from "../../components/DualImageUpload";

const normalizeListing = (listing) => {
  const name = listing.name || listing.User?.fullName || listing.User?.username || "Expert";
  let imgUrl = listing.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=128`;
  if (imgUrl && !imgUrl.startsWith("http://") && !imgUrl.startsWith("https://")) {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5002";
    imgUrl = imgUrl.startsWith("/") ? `${backendUrl}${imgUrl}` : `${backendUrl}/${imgUrl}`;
  }
  return {
    id: listing.id,
    userId: listing.userId,
    title: listing.title,
    name: listing.name || listing.User?.fullName || listing.User?.username || "Expert",
    specialization: listing.specialization || listing.specialty,
    description: listing.description,
    hourlyRate: listing.hourlyRate,
    location: listing.location || "-",
    image: imgUrl,
    rating: listing.rating || 4.8,
    reviews: listing.reviews || 24,
    owner: listing.name || listing.User?.fullName || listing.User?.username || "Expert",
    specialty: listing.specialization || listing.specialty,
    email: listing.User?.email || "",
    academicDegree: listing.academicDegree || listing.User?.AgroExpertProfile?.academicDegree || "",
    experienceYears: listing.experienceYears || listing.User?.AgroExpertProfile?.experienceYears || 0,
  };
};

const Experts = () => {
  const navigate = useNavigate();
  const { user, getExpertListings, createExpertListing, updateExpertListing, deleteExpertListing } = useAuth();
  const { t } = useLanguage();
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expertCards, setExpertCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [createForm, setCreateForm] = useState({ title: "", specialty: "", description: "", hourlyRate: "", location: "", imageUrl: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const loadListings = async () => {
      try {
        const data = await getExpertListings();
        if (Array.isArray(data)) setExpertCards(data.map(normalizeListing));
      } catch (err) {
        console.error("Failed to load expert listings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, [user, navigate, getExpertListings]);

  const expertType = user?.role === "AGRO_EXPERT" && user?.isApproved;
  const canCreate = expertType || user?.role === "ADMIN";

  const handleCreateInput = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
    setSuccessMessage("");
  };

  const validateCreateForm = () => {
    const fe = {};
    const t_ = createForm.title.trim();
    if (!t_) fe.title = "Title is required";
    else if (t_.length < 5) fe.title = "Title must be at least 5 characters";
    else if (t_.length > 50) fe.title = "Title must be at most 50 characters";

    const s_ = createForm.specialty.trim();
    if (!s_) fe.specialty = "Specialty is required";
    else if (s_.length < 3) fe.specialty = "Specialty must be at least 3 characters";
    else if (s_.length > 30) fe.specialty = "Specialty must be at most 30 characters";

    const d_ = createForm.description.trim();
    if (!d_) fe.description = "Description is required";
    else if (d_.length < 15) fe.description = "Description must be at least 15 characters";
    else if (d_.length > 500) fe.description = "Description must be at most 500 characters";

    const rate = Number(createForm.hourlyRate);
    if (!createForm.hourlyRate) fe.hourlyRate = "Hourly rate is required";
    else if (isNaN(rate) || rate <= 0) fe.hourlyRate = "Hourly rate must be a positive number";

    const l_ = createForm.location.trim();
    if (!l_) fe.location = "Location is required";
    else if (l_.length < 3) fe.location = "Location must be at least 3 characters";
    else if (l_.length > 50) fe.location = "Location must be at most 50 characters";

    const img_ = createForm.imageUrl.trim();
    if (!imageFile && img_ && !/^https?:\/\/.+/.test(img_)) {
      fe.imageUrl = "Image URL must start with http:// or https://";
    }

    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const handleCreateListing = async () => {
    if (!validateCreateForm()) return;
    try {
      let newListing;
      if (imageFile) {
        const formData = new FormData();
        formData.append("title", createForm.title);
        formData.append("specialty", createForm.specialty);
        formData.append("description", createForm.description);
        formData.append("hourlyRate", Number(createForm.hourlyRate));
        formData.append("location", createForm.location);
        formData.append("imageFile", imageFile);
        if (isEditing) {
          newListing = await updateExpertListing(editId, formData);
        } else {
          newListing = await createExpertListing(formData);
        }
      } else {
        if (isEditing) {
          newListing = await updateExpertListing(editId, { ...createForm, hourlyRate: Number(createForm.hourlyRate) });
        } else {
          newListing = await createExpertListing({ ...createForm, hourlyRate: Number(createForm.hourlyRate) });
        }
      }
      
      if (isEditing) {
        setExpertCards((prev) => prev.map(card => card.id === editId ? normalizeListing(newListing) : card));
        toast.success("Expert listing updated successfully!");
      } else {
        setExpertCards((prev) => [normalizeListing(newListing), ...prev]);
        toast.success(t("experts.created") || "Expert listing created successfully!");
      }
      
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || t("common.error"));
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setIsEditing(false);
    setEditId(null);
    setCreateForm({ title: "", specialty: "", description: "", hourlyRate: "", location: "", imageUrl: "" });
    setImageFile(null);
    setImagePreview("");
    setFieldErrors({});
  };

  const handleEditClick = (expert) => {
    setIsEditing(true);
    setEditId(expert.id);
    setCreateForm({
      title: expert.title,
      specialty: expert.specialty,
      description: expert.description,
      hourlyRate: expert.hourlyRate.toString(),
      location: expert.location,
      imageUrl: expert.image
    });
    setImagePreview(expert.image);
    setShowCreateModal(true);
  };

  const canEdit = (expert) => {
    if (!user) return false;
    return user.role === "ADMIN" || user.id === expert.userId;
  };

  const handleQuickImageUpload = async (expert, file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("imageFile", file);
      const res = await updateExpertListing(expert.id, formData);
      setExpertCards((prev) => prev.map(c => c.id === expert.id ? normalizeListing(res) : c));
      toast.success("Profile photo updated successfully!");
    } catch (err) {
      toast.error("Failed to update photo");
      console.error(err);
    }
  };

  const executeDelete = async (id) => {
    try {
      await deleteExpertListing(id);
      setExpertCards((prev) => prev.filter(card => card.id !== id));
      toast.success("Expert listing deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete expert listing");
    }
  };

  const handleDelete = (id) => {
    toast("Are you sure you want to delete this expert card?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => executeDelete(id),
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const uniqueSpecialties = ["All", ...new Set(expertCards.map(e => e.specialty))].filter(Boolean);

  const filteredExperts = expertCards.filter((expert) => {
    const matchesSearch = expert.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          expert.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          expert.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialtyFilter === "All" || !selectedSpecialtyFilter
                             ? true 
                             : expert.specialty === selectedSpecialtyFilter;

    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted font-bold">{t("experts.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-main dark:text-white">
            {t("experts.title")} <span className="text-primary-base">{t("experts.titleAccent")}</span>
          </h1>
          <p className="text-text-muted dark:text-text-disabled text-lg">{t("experts.subtitle")}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <LuSearch className="absolute start-4 top-1/2 -translate-y-1/2 text-text-disabled" size={20} />
            <input type="text" placeholder={t("experts.search")}
              className="w-full ps-12 pe-4 py-4 bg-surface-card dark:bg-slate-800 border border-border-default dark:border-slate-700 text-text-main dark:text-white placeholder:text-text-disabled rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="relative w-full md:w-64 z-20">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full px-5 py-4 bg-surface-card dark:bg-slate-800 border border-border-default dark:border-slate-700 text-text-main dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm cursor-pointer flex justify-between items-center font-semibold"
            >
              <span className="truncate">{selectedSpecialtyFilter === "All" ? "All Specialties" : selectedSpecialtyFilter}</span>
              <LuChevronDown className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full start-0 mt-2 w-full max-h-64 overflow-y-auto bg-surface-card dark:bg-slate-800 border border-border-default dark:border-slate-700 rounded-2xl shadow-xl z-50 flex flex-col py-2 custom-scrollbar"
                >
                  {uniqueSpecialties.map((spec) => (
                    <button
                      key={spec}
                      onClick={() => {
                        setSelectedSpecialtyFilter(spec);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-start px-5 py-3 text-sm font-bold transition-colors hover:bg-surface-secondary dark:hover:bg-slate-700 ${
                        selectedSpecialtyFilter === spec 
                          ? "bg-primary-light dark:bg-emerald-900/30 text-primary-base dark:text-emerald-400" 
                          : "text-text-muted dark:text-slate-300"
                      }`}
                    >
                      {spec === "All" ? "All Specialties" : spec}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {canCreate && (
            <button onClick={() => setShowCreateModal(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-base px-6 py-4 text-white font-black hover:bg-primary-hover hover:-translate-y-1 hover:shadow-emerald-500/30 active:scale-95 transition-all duration-300 shadow-xl whitespace-nowrap shrink-0">
              <LuPlus size={20} className="shrink-0" /> 
              <span>{t("experts.createCard")}</span>
            </button>
          )}
        </div>
      </section>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperts.map((expert) => (
          <motion.div key={`${expert.id}-${expert.title}`} layoutId={`expert-container-${expert.id}`}
            whileHover={{ y: -8 }}
            className="bg-surface-card dark:bg-slate-900 rounded-[2.5rem] p-8 border border-border-default dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col items-center text-center group cursor-pointer"
            onClick={() => setSelectedExpert(expert)}>
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full bg-primary-light dark:bg-green-900/20 p-1 group/avatar relative overflow-hidden">
                <img 
                  src={expert.image} 
                  className="w-full h-full rounded-full object-cover" 
                  alt={expert.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=0D9488&color=fff&size=128`;
                  }}
                />
                {canEdit(expert) && (
                  <label className="absolute inset-1 rounded-full bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm z-10">
                    <LuUpload className="text-white mb-1" size={24} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Upload</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleQuickImageUpload(expert, e.target.files[0])} />
                  </label>
                )}
              </div>
              <div className="absolute -bottom-2 -end-2 bg-surface-card dark:bg-slate-900 p-2 rounded-xl shadow-lg border border-gray-50 dark:border-slate-800">
                <LuAward className="text-yellow-500" size={20} />
              </div>
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-center gap-1">
                <h3 className="text-2xl font-bold dark:text-white">{expert.title}</h3>
                <LuBadgeCheck className="text-blue-500" size={20} />
              </div>
              <p className="text-primary-base dark:text-green-400 font-semibold text-sm uppercase tracking-wide">{expert.specialization}</p>
              {expert.email && (
                <p className="text-text-muted dark:text-text-disabled text-sm mt-1">{expert.email}</p>
              )}
              <div className="flex items-center justify-center gap-2 mt-3 bg-surface-secondary dark:bg-slate-800/50 px-3 py-1.5 rounded-full w-fit mx-auto">
                <LuStar className="text-yellow-500" fill="currentColor" size={14} />
                <span className="font-bold text-sm dark:text-white">{expert.rating}</span>
                <span className="text-text-disabled text-xs">({expert.reviews} {t("experts.reviews")})</span>
              </div>
            </div>

            <div className="mt-8 w-full text-start">
              <p className="text-sm font-bold text-text-muted dark:text-text-disabled uppercase tracking-wide mb-2">{t("experts.hourlyRate")}</p>
              <p className="text-2xl font-black dark:text-white mb-4">{t("common.egp")} {expert.hourlyRate.toLocaleString()}</p>
              <p className="text-sm text-text-muted dark:text-text-disabled leading-relaxed line-clamp-3">{expert.description}</p>
            </div>

            <button className="mt-8 w-full py-4 bg-gray-900 dark:bg-primary-base text-white rounded-2xl font-bold hover:bg-primary-hover transition-colors shadow-lg">
              {t("experts.viewProfile")}
            </button>
            
            {(user?.role === "ADMIN" || expert.userId === user?.id) && (
              <div className="flex gap-2 mt-4 w-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleEditClick(expert); }}
                  className="flex-1 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(expert.id); }}
                  className="flex-1 py-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Expert Detail Modal */}
      <AnimatePresence>
        {selectedExpert && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedExpert(null)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100]" />
            <motion.div layoutId={`expert-container-${selectedExpert.id}`}
              className="fixed inset-0 m-auto w-[95%] max-w-2xl h-fit max-h-[90vh] bg-surface-card dark:bg-slate-900 z-[100] rounded-[3rem] p-10 overflow-y-auto border border-border-default dark:border-slate-800 shadow-2xl">
              <button onClick={() => setSelectedExpert(null)}
                className="absolute top-8 end-8 p-3 hover:bg-surface-secondary dark:hover:bg-slate-800 rounded-full transition-colors dark:text-white">
                <LuX size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-start">
                <img 
                  src={selectedExpert.image} 
                  className="w-40 h-40 rounded-[2.5rem] bg-primary-light dark:bg-green-900/20 object-cover" 
                  alt={selectedExpert.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedExpert.name)}&background=0D9488&color=fff&size=128`;
                  }}
                />
                <div className="flex-1 space-y-4 pt-4">
                  <div>
                    <h2 className="text-3xl font-black dark:text-white">{selectedExpert.title}</h2>
                    <p className="text-primary-base font-bold text-lg">{selectedExpert.specialization}</p>
                  </div>
                  <p className="text-text-subtle dark:text-gray-300 leading-relaxed text-lg">{selectedExpert.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-4 bg-surface-secondary dark:bg-slate-800 rounded-2xl">
                      <LuBriefcase className="text-primary-base" size={24} />
                      <div>
                        <p className="text-xs text-text-disabled font-bold uppercase">{t("experts.hourlyRate")}</p>
                        <p className="font-bold dark:text-white">{t("common.egp")} {selectedExpert.hourlyRate.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-surface-secondary dark:bg-slate-800 rounded-2xl">
                      <LuMapPin className="text-primary-base" size={24} />
                      <div>
                        <p className="text-xs text-text-disabled font-bold uppercase">{t("experts.location")}</p>
                        <p className="font-bold dark:text-white">{selectedExpert.location || "-"}</p>
                      </div>
                    </div>
                    {selectedExpert.academicDegree && (
                      <div className="flex items-center gap-3 p-4 bg-surface-secondary dark:bg-slate-800 rounded-2xl">
                        <LuGraduationCap className="text-blue-600" size={24} />
                        <div>
                          <p className="text-xs text-text-disabled font-bold uppercase">{t("experts.degree")}</p>
                          <p className="font-bold dark:text-white">{selectedExpert.academicDegree}</p>
                        </div>
                      </div>
                    )}
                    {selectedExpert.experienceYears > 0 && (
                      <div className="flex items-center gap-3 p-4 bg-surface-secondary dark:bg-slate-800 rounded-2xl">
                        <LuAward className="text-yellow-500" size={24} />
                        <div>
                          <p className="text-xs text-text-disabled font-bold uppercase">{t("experts.experience")}</p>
                          <p className="font-bold dark:text-white">{selectedExpert.experienceYears} {t("experts.years")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => navigate(`/chat/${selectedExpert.userId || selectedExpert.id}`)}
                      className="flex-1 py-5 bg-primary-base text-white rounded-3xl font-black text-xl hover:bg-primary-hover transition-all transform hover:scale-[1.02]">
                      {t("experts.consult")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-card dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl">
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-text-main dark:text-white">
                    {isEditing ? "Edit Expert Listing" : t("experts.createCard")}
                  </h2>
                  <p className="text-sm text-text-muted dark:text-text-disabled">{t("experts.createSub")}</p>
                </div>
                <button onClick={closeModal} className="text-text-muted dark:text-slate-300 hover:text-red-500 transition">
                  <LuX size={28} />
                </button>
              </div>

              {formError && <div className="mb-6 p-4 bg-red-100 text-red-600 rounded-2xl text-sm font-bold">{formError}</div>}
              {successMessage && <div className="mb-6 p-4 bg-green-100 text-green-600 rounded-2xl text-sm font-bold">{successMessage}</div>}

              <div className="space-y-6">
                <DualImageUpload label="Profile Picture (Optional)"
                  previewImage={imagePreview}
                  value={createForm.imageUrl}
                  onFileChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      setCreateForm(prev => ({ ...prev, imageUrl: "" }));
                    }
                  }}
                  onChange={(e) => {
                    setImageFile(null);
                    setCreateForm(prev => ({ ...prev, imageUrl: e.target.value }));
                  }}
                />
                
                <div>
                  <label className="block text-sm font-bold text-text-main dark:text-slate-200 mb-2">Name / Title</label>
                  <input type="text" name="title" value={createForm.title} onChange={handleCreateInput}
                    className={`w-full px-4 py-3 bg-surface-secondary dark:bg-slate-800 border ${fieldErrors.title ? "border-red-500" : "border-border-default dark:border-slate-700"} rounded-xl outline-none focus:ring-2 focus:ring-primary-base dark:text-white`}
                    placeholder="e.g. Dr. Ahmed - Soil Expert" />
                  {fieldErrors.title && <p className="mt-1 text-xs text-red-500 font-bold">{fieldErrors.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text-main dark:text-slate-200 mb-2">Specialty</label>
                    <input type="text" name="specialty" value={createForm.specialty} onChange={handleCreateInput}
                      className={`w-full px-4 py-3 bg-surface-secondary dark:bg-slate-800 border ${fieldErrors.specialty ? "border-red-500" : "border-border-default dark:border-slate-700"} rounded-xl outline-none focus:ring-2 focus:ring-primary-base dark:text-white`}
                      placeholder="e.g. Soil Management" />
                    {fieldErrors.specialty && <p className="mt-1 text-xs text-red-500 font-bold">{fieldErrors.specialty}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-main dark:text-slate-200 mb-2">Hourly Rate (EGP)</label>
                    <input type="number" name="hourlyRate" value={createForm.hourlyRate} onChange={handleCreateInput}
                      onWheel={(e) => e.target.blur()}
                      className={`w-full px-4 py-3 bg-surface-secondary dark:bg-slate-800 border ${fieldErrors.hourlyRate ? "border-red-500" : "border-border-default dark:border-slate-700"} rounded-xl outline-none focus:ring-2 focus:ring-primary-base dark:text-white`}
                      placeholder="e.g. 200" />
                    {fieldErrors.hourlyRate && <p className="mt-1 text-xs text-red-500 font-bold">{fieldErrors.hourlyRate}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-main dark:text-slate-200 mb-2">Location</label>
                  <input type="text" name="location" value={createForm.location} onChange={handleCreateInput}
                    className={`w-full px-4 py-3 bg-surface-secondary dark:bg-slate-800 border ${fieldErrors.location ? "border-red-500" : "border-border-default dark:border-slate-700"} rounded-xl outline-none focus:ring-2 focus:ring-primary-base dark:text-white`}
                    placeholder="e.g. Cairo, Egypt" />
                  {fieldErrors.location && <p className="mt-1 text-xs text-red-500 font-bold">{fieldErrors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-main dark:text-slate-200 mb-2">Description / Bio</label>
                  <textarea name="description" value={createForm.description} onChange={handleCreateInput} rows={4}
                    className={`w-full px-4 py-3 bg-surface-secondary dark:bg-slate-800 border ${fieldErrors.description ? "border-red-500" : "border-border-default dark:border-slate-700"} rounded-xl outline-none focus:ring-2 focus:ring-primary-base dark:text-white`}
                    placeholder="Describe your expertise and services..." />
                  {fieldErrors.description && <p className="mt-1 text-xs text-red-500 font-bold">{fieldErrors.description}</p>}
                </div>

                <button onClick={handleCreateListing}
                  className="w-full py-4 bg-primary-base text-white font-black rounded-2xl hover:bg-primary-hover transition-colors shadow-lg shadow-green-500/30">
                  {isEditing ? "Save Changes" : t("experts.publish")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experts;
