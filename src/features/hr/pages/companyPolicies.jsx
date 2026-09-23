import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X, BookOpen, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* =====================================================
   DATA
===================================================== */

const initialPolicies = [
  {
    id: "punctuality",
    translationKey: "punctuality",
  },
  {
    id: "leave",
    translationKey: "leave",
  },
  {
    id: "salary-advance",
    translationKey: "salaryAdvance",
  },
];

/* =====================================================
   MOTION
===================================================== */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: {
      duration: 0.18,
    },
  },
};

/* =====================================================
   POLICY CARD
===================================================== */

function PolicyCard({ policy, onEdit }) {
  const { t } = useTranslation();

  const isTranslatedPolicy = Boolean(policy.translationKey);

  const title = isTranslatedPolicy
    ? t(`hrCompanyPolicies.policies.${policy.translationKey}.title`)
    : policy.title;

  const description = isTranslatedPolicy
    ? t(`hrCompanyPolicies.policies.${policy.translationKey}.description`)
    : policy.description;

  const effectiveDate = isTranslatedPolicy
    ? t(`hrCompanyPolicies.policies.${policy.translationKey}.effectiveDate`)
    : policy.effectiveDate;

  const version = isTranslatedPolicy
    ? t(`hrCompanyPolicies.policies.${policy.translationKey}.version`)
    : policy.version;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="
        group
        rounded-2xl
        border
        border-[#e2e8f0]/80
        bg-white
        p-5
        shadow-[0_1px_3px_rgba(0,0,0,0.03)]
        transition-shadow
        duration-200
        hover:shadow-md
      "
    >
      {/* =====================================================
          ICON + STATUS
      ===================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-[#eff6ff]
            text-[#3b82f6]
            transition
            duration-200
            group-hover:scale-105
          "
        >
          <BookOpen className="h-4 w-4" />
        </div>

        <span
          className="
            rounded-full
            border
            border-[#a7f3d0]
            bg-[#ecfdf5]
            px-3
            py-1
            text-[11px]
            font-bold
            text-[#047857]
          "
        >
          {t("hrCompanyPolicies.aiSynced")}
        </span>
      </div>

      {/* =====================================================
          TITLE
      ===================================================== */}

      <h3 className="mt-4 text-base font-bold tracking-tight text-[#1e293b]">
        {title}
      </h3>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <p className="mt-1 text-sm font-normal leading-6 text-[#64748b]">
        {description}
      </p>

      {/* =====================================================
          POLICY DETAILS
      ===================================================== */}

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#f1f5f9] pt-4">
        <div className="rounded-xl bg-[#f8fafc] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
            {t("hrCompanyPolicies.effectiveDate")}
          </p>

          <p className="mt-1 text-xs font-semibold text-[#1e293b]">
            {effectiveDate}
          </p>
        </div>

        <div className="rounded-xl bg-[#f8fafc] p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
            {t("hrCompanyPolicies.document")}
          </p>

          <p className="mt-1 text-xs font-semibold text-[#1e293b]">{version}</p>
        </div>
      </div>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#f1f5f9] pt-4">
        {/* EDIT */}

        <button
          type="button"
          onClick={() => onEdit(policy)}
          className="
            rounded-lg
            border
            border-[#e2e8f0]
            bg-white
            px-3
            py-2
            text-xs
            font-semibold
            text-[#475569]
            transition
            hover:bg-[#f8fafc]
          "
        >
          {t("hrCompanyPolicies.editDocument")}
        </button>

        {/* DOWNLOAD */}

        <button
          type="button"
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            px-2
            py-2
            text-xs
            font-semibold
            text-[#475569]
            transition
            hover:bg-[#f8fafc]
            hover:text-[#243B53]
          "
        >
          <Download className="h-3.5 w-3.5" />

          {t("hrCompanyPolicies.downloadPdf")}
        </button>
      </div>
    </motion.div>
  );
}

/* =====================================================
   ADD / EDIT POLICY MODAL
===================================================== */

function AddPolicyModal({ onClose, onSave, editingPolicy }) {
  const { t } = useTranslation();

  const getInitialTitle = () => {
    if (!editingPolicy) return "";

    if (editingPolicy.translationKey) {
      return t(
        `hrCompanyPolicies.policies.${editingPolicy.translationKey}.title`,
      );
    }

    return editingPolicy.title || "";
  };

  const getInitialEffectiveDate = () => {
    if (!editingPolicy) return "";

    if (editingPolicy.translationKey) {
      return t(
        `hrCompanyPolicies.policies.${editingPolicy.translationKey}.effectiveDate`,
      );
    }

    return editingPolicy.effectiveDate || "";
  };

  const [title, setTitle] = useState(getInitialTitle());
  const [effectiveDate, setEffectiveDate] = useState(getInitialEffectiveDate());
  const [owner, setOwner] = useState(editingPolicy?.owner || "");

  const isEditing = Boolean(editingPolicy);

  /* =====================================================
     SAVE FORM
  ===================================================== */

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title,
      effectiveDate,
      owner,
    });
  };

  return (
    <motion.div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[#0f172a]/40
        p-4
        backdrop-blur-[2px]
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-2xl
          border
          border-[#e2e8f0]/80
          bg-white
          shadow-xl
        "
      >
        {/* =====================================================
            MODAL HEADER
        ===================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[#f1f5f9]
            px-5
            py-4
          "
        >
          <div>
            <h2 className="text-base font-bold text-[#1e293b]">
              {isEditing
                ? t("hrCompanyPolicies.editPolicyDocument")
                : t("hrCompanyPolicies.addPolicyDocument")}
            </h2>

            <p className="mt-1 text-xs text-[#64748b]">
              {isEditing
                ? t("hrCompanyPolicies.editDocument")
                : t("hrCompanyPolicies.addPolicyDocument")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-[#94a3b8]
              transition
              hover:bg-[#f8fafc]
              hover:text-[#475569]
            "
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="space-y-5 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* POLICY TITLE */}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {t("hrCompanyPolicies.policyTitle")}
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("hrCompanyPolicies.policyTitlePlaceholder")}
                className="
                  mt-1.5
                  w-full
                  rounded-lg
                  border
                  border-[#e2e8f0]
                  bg-white
                  px-3
                  py-2.5
                  text-xs
                  text-[#1e293b]
                  outline-none
                  transition
                  placeholder:text-[#94a3b8]
                  focus:border-[#94a3b8]
                  focus:ring-2
                  focus:ring-[#f1f5f9]
                "
              />
            </div>

            {/* EFFECTIVE DATE */}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {t("hrCompanyPolicies.effectiveDateLabel")}
              </label>

              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                placeholder={t("hrCompanyPolicies.effectiveDatePlaceholder")}
                className="
                  mt-1.5
                  w-full
                  rounded-lg
                  border
                  border-[#e2e8f0]
                  bg-white
                  px-3
                  py-2.5
                  text-xs
                  text-[#1e293b]
                  outline-none
                  transition
                  placeholder:text-[#94a3b8]
                  focus:border-[#94a3b8]
                  focus:ring-2
                  focus:ring-[#f1f5f9]
                "
              />
            </div>
          </div>

          {/* OWNER */}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              {t("hrCompanyPolicies.owner")}
            </label>

            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder={t("hrCompanyPolicies.ownerPlaceholder")}
              className="
                mt-1.5
                w-full
                rounded-lg
                border
                border-[#e2e8f0]
                bg-white
                px-3
                py-2.5
                text-xs
                text-[#1e293b]
                outline-none
                transition
                placeholder:text-[#94a3b8]
                focus:border-[#94a3b8]
                focus:ring-2
                focus:ring-[#f1f5f9]
              "
            />
          </div>

          {/* =====================================================
              MODAL BUTTONS
          ===================================================== */}

          <div className="flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg
                border
                border-[#e2e8f0]
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-[#475569]
                transition
                hover:bg-[#f8fafc]
              "
            >
              {t("hrCompanyPolicies.cancel")}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                rounded-lg
                bg-[#243B53]
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#1c2f42]
              "
            >
              {t("hrCompanyPolicies.saveChanges")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =====================================================
   COMPANY POLICIES PAGE
===================================================== */

export default function CompanyPolicies() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const [policies, setPolicies] = useState(initialPolicies);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingPolicy, setEditingPolicy] = useState(null);

  /* =====================================================
     ADD POLICY
  ===================================================== */

  const handleAddPolicy = () => {
    setEditingPolicy(null);
    setIsModalOpen(true);
  };

  /* =====================================================
     EDIT POLICY
  ===================================================== */

  const handleEditPolicy = (policy) => {
    setEditingPolicy(policy);
    setIsModalOpen(true);
  };

  /* =====================================================
     SAVE ADD / EDIT
  ===================================================== */

  const handleSavePolicy = ({ title, effectiveDate, owner }) => {
    /* =====================================================
       EDIT EXISTING POLICY
    ===================================================== */

    if (editingPolicy) {
      setPolicies((prev) =>
        prev.map((policy) =>
          policy.id === editingPolicy.id
            ? {
                ...policy,
                translationKey: undefined,
                title,
                effectiveDate:
                  effectiveDate || t("hrCompanyPolicies.emptyDate"),
                description: owner
                  ? t("hrCompanyPolicies.ownedBy", {
                      owner,
                    })
                  : policy.translationKey
                    ? t(
                        `hrCompanyPolicies.policies.${policy.translationKey}.description`,
                      )
                    : policy.description,
              }
            : policy,
        ),
      );
    } else {
      /* =====================================================
         ADD NEW POLICY
      ===================================================== */

      setPolicies((prev) => [
        ...prev,
        {
          id: `${title.toLowerCase().replace(/\s+/g, "-")}-${prev.length}`,
          title,
          description: owner
            ? t("hrCompanyPolicies.ownedBy", {
                owner,
              })
            : "",
          effectiveDate: effectiveDate || t("hrCompanyPolicies.emptyDate"),
          version: t("hrCompanyPolicies.newVersion"),
        },
      ]);
    }

    setIsModalOpen(false);
    setEditingPolicy(null);
  };

  return (
    <>
      <motion.div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <motion.header
          variants={itemVariants}
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b879f]">
              HR / COMPANY POLICIES
            </p>

            <h1 className="mt-1 text-lg font-bold tracking-tight text-[#1e293b] md:text-[21px]">
              {t("hrCompanyPolicies.title")}
            </h1>

            <p className="mt-1 text-sm font-normal text-[#64748b]">
              {t("hrCompanyPolicies.subtitle")}
            </p>
          </div>

          {/* ADD POLICY */}

          <button
            type="button"
            onClick={handleAddPolicy}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-[#243B53]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#1c2f42]
            "
          >
            <Plus className="h-4 w-4" />

            <span>{t("hrCompanyPolicies.addPolicyDocument")}</span>
          </button>
        </motion.header>

        {/* =====================================================
            POLICY CARDS
        ===================================================== */}

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {policies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onEdit={handleEditPolicy}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      <AnimatePresence>
        {isModalOpen && (
          <AddPolicyModal
            onClose={() => {
              setIsModalOpen(false);
              setEditingPolicy(null);
            }}
            onSave={handleSavePolicy}
            editingPolicy={editingPolicy}
          />
        )}
      </AnimatePresence>
    </>
  );
}
