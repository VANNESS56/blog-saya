// ===== App Init - Wait for DOM =====
document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    // ===== DOM Elements =====
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");
    const sidebarToggle = document.getElementById("sidebar-toggle");

    const supabaseForm = document.getElementById("supabase-config-form");
    const inputUrl = document.getElementById("input-supabase-url");
    const inputKey = document.getElementById("input-supabase-key");
    const setupAlert = document.getElementById("setup-alert");
    const dbStatus = document.getElementById("db-status");
    const dbIcon = document.getElementById("db-icon");
    const totalTriggersEl = document.getElementById("total-triggers");
    const triggersList = document.getElementById("triggers-list");
    const tableLoading = document.getElementById("table-loading");
    const tableEmpty = document.getElementById("table-empty");
    const searchInput = document.getElementById("search-input");

    const botSettingsForm = document.getElementById("bot-settings-form");
    const inputBotName = document.getElementById("input-bot-name");
    const inputOwnerName = document.getElementById("input-owner-name");
    const inputOwnerNumbers = document.getElementById("input-owner-numbers");
    const inputPrefix = document.getElementById("input-prefix");
    const inputChannelLink = document.getElementById("input-channel-link");
    const inputNoPrefix = document.getElementById("input-no-prefix");
    const saveBotSettingsBtn = document.getElementById("save-bot-settings-btn");

    const addTriggerForm = document.getElementById("add-trigger-form");
    const editTriggerForm = document.getElementById("edit-trigger-form");
    const editOriginalKey = document.getElementById("edit-original-key");
    const editTriggerKey = document.getElementById("edit-trigger-key");
    const editTriggerValue = document.getElementById("edit-trigger-value");

    const toastEl = document.getElementById("liveToast");
    const toastMsg = document.getElementById("toast-message");
    const toastIcon = document.getElementById("toast-icon");

    let toastInstance = null;
    let supabaseClient = null;
    let allTriggers = [];

    // ===== Toast Helper =====
    function showToast(message, type) {
        type = type || "success";
        toastMsg.textContent = message;
        toastEl.className = "toast align-items-center text-white border-0 rounded-3 bg-" + (type === "success" ? "success" : "danger");
        toastIcon.className = "bi " + (type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill") + " me-2";
        if (!toastInstance) {
            toastInstance = new bootstrap.Toast(toastEl, { delay: 3000 });
        }
        toastInstance.show();
    }

    // ===== Sidebar Toggle =====
    sidebarToggle.addEventListener("click", function() {
        sidebar.classList.toggle("open");
    });

    sidebarOverlay.addEventListener("click", function() {
        sidebar.classList.remove("open");
    });

    // ===== SPA Navigation =====
    var menuLinks = document.querySelectorAll("#sidebar-menu .sidebar-link");
    var allSections = ["dashboard-section", "triggers-section", "bot-settings-section", "settings-section"];

    menuLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            var target = link.getAttribute("data-target");

            // Update active state
            menuLinks.forEach(function(l) { l.classList.remove("active"); });
            link.classList.add("active");

            // Show/hide sections
            allSections.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    if (id === target) {
                        el.classList.remove("d-none");
                    } else {
                        el.classList.add("d-none");
                    }
                }
            });

            // Close sidebar on mobile
            if (window.innerWidth < 768) {
                sidebar.classList.remove("open");
            }
        });
    });

    // ===== Theme Toggle =====
    var themeToggleBtn = document.getElementById("theme-toggle-btn");
    var themeIcon = document.getElementById("theme-icon");

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
        themeIcon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon";
    }

    themeToggleBtn.addEventListener("click", function() {
        var current = document.documentElement.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
    });

    // ===== Supabase Config =====
    function loadSupabaseConfig() {
        var url = localStorage.getItem("supabase_url");
        var key = localStorage.getItem("supabase_key");

        if (url && key) {
            inputUrl.value = url;
            inputKey.value = key;
            initSupabase(url, key);
        } else {
            setupAlert.style.display = "block";
            dbStatus.textContent = "Belum Diatur";
            dbStatus.className = "stat-value text-warning";
            tableLoading.classList.add("d-none");
            tableEmpty.classList.remove("d-none");
        }
    }

    function initSupabase(url, key) {
        try {
            supabaseClient = window.supabase.createClient(url, key);
            setupAlert.style.display = "none";
            fetchData();
        } catch (e) {
            console.error("Init Supabase failed:", e);
            showToast("Inisialisasi Supabase gagal.", "error");
        }
    }

    supabaseForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var url = inputUrl.value.trim();
        var key = inputKey.value.trim();
        localStorage.setItem("supabase_url", url);
        localStorage.setItem("supabase_key", key);
        showToast("Konfigurasi Supabase berhasil disimpan!");
        initSupabase(url, key);
    });

    // ===== Fetch All Data =====
    function fetchData() {
        dbStatus.textContent = "Menghubungkan...";
        dbStatus.className = "stat-value text-primary";

        supabaseClient.from("triggers").select("*").then(function(res) {
            if (res.error) throw res.error;

            dbStatus.textContent = "Connected";
            dbStatus.className = "stat-value text-success";
            dbIcon.className = "bi bi-database-check stat-icon text-success";

            allTriggers = res.data || [];
            renderTriggers(allTriggers);
            fetchBotSettings();
        }).catch(function(err) {
            console.error("DB Error:", err);
            dbStatus.textContent = "Error";
            dbStatus.className = "stat-value text-danger";
            dbIcon.className = "bi bi-database-x stat-icon text-danger";
            showToast("Gagal terhubung ke Supabase. Cek kredensial.", "error");
            tableLoading.classList.add("d-none");
            tableEmpty.classList.remove("d-none");
        });
    }

    // ===== Bot Settings =====
    function fetchBotSettings() {
        if (!supabaseClient) return;
        supabaseClient.from("bot_settings").select("*").eq("id", 1).single().then(function(res) {
            if (res.error) throw res.error;
            var data = res.data;
            if (data) {
                inputBotName.value = data.bot_name || "";
                inputOwnerName.value = data.owner_name || "";
                var nums = Array.isArray(data.owner_numbers) ? data.owner_numbers : JSON.parse(data.owner_numbers || "[]");
                inputOwnerNumbers.value = nums.join(", ");
                var pref = Array.isArray(data.prefix) ? data.prefix : JSON.parse(data.prefix || "[]");
                inputPrefix.value = pref.join(", ");
                inputChannelLink.value = data.channel_link || "";
                inputNoPrefix.checked = !!data.no_prefix;
                saveBotSettingsBtn.removeAttribute("disabled");
            }
        }).catch(function(err) {
            console.error("Bot settings error:", err);
        });
    }

    botSettingsForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (!supabaseClient) return showToast("Supabase belum terkonfigurasi!", "error");

        saveBotSettingsBtn.setAttribute("disabled", "true");
        supabaseClient.from("bot_settings").upsert({
            id: 1,
            bot_name: inputBotName.value.trim(),
            owner_name: inputOwnerName.value.trim(),
            owner_numbers: inputOwnerNumbers.value.split(",").map(function(s) { return s.trim(); }).filter(Boolean),
            prefix: inputPrefix.value.split(",").map(function(s) { return s.trim(); }).filter(Boolean),
            no_prefix: inputNoPrefix.checked,
            channel_link: inputChannelLink.value.trim()
        }).then(function(res) {
            if (res.error) throw res.error;
            showToast("Pengaturan Bot berhasil disimpan!");
        }).catch(function(err) {
            showToast("Gagal menyimpan: " + err.message, "error");
        }).finally(function() {
            saveBotSettingsBtn.removeAttribute("disabled");
        });
    });

    // ===== Render Triggers =====
    function renderTriggers(triggers) {
        tableLoading.classList.add("d-none");
        triggersList.innerHTML = "";
        totalTriggersEl.textContent = triggers.length;

        if (triggers.length === 0) {
            tableEmpty.classList.remove("d-none");
            return;
        }
        tableEmpty.classList.add("d-none");

        triggers.forEach(function(tr, idx) {
            var row = document.createElement("tr");
            var ek = (tr.key || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var ev = (tr.value || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var imgIndicator = tr.image_url ? ' <span class="badge bg-success" title="' + tr.image_url + '"><i class="bi bi-image"></i> Gambar</span>' : '';
            row.innerHTML =
                '<td class="text-muted fw-bold">' + (idx + 1) + '</td>' +
                '<td><span class="badge-key">' + ek + '</span></td>' +
                '<td><div class="text-truncate" style="max-width:400px;">' + ev + imgIndicator + '</div></td>' +
                '<td class="text-end">' +
                    '<button class="btn btn-sm btn-outline-primary me-1 btn-edit-trigger" data-key="' + ek + '"><i class="bi bi-pencil"></i></button>' +
                    '<button class="btn btn-sm btn-outline-danger btn-delete-trigger" data-key="' + ek + '"><i class="bi bi-trash"></i></button>' +
                '</td>';
            triggersList.appendChild(row);
        });

        // Attach edit/delete handlers via delegation
        triggersList.querySelectorAll(".btn-edit-trigger").forEach(function(btn) {
            btn.addEventListener("click", function() { openEditModal(btn.getAttribute("data-key")); });
        });
        triggersList.querySelectorAll(".btn-delete-trigger").forEach(function(btn) {
            btn.addEventListener("click", function() { deleteTrigger(btn.getAttribute("data-key")); });
        });
    }

    // ===== Search =====
    searchInput.addEventListener("input", function(e) {
        var q = e.target.value.toLowerCase().trim();
        renderTriggers(allTriggers.filter(function(t) {
            return t.key.includes(q) || t.value.toLowerCase().includes(q);
        }));
    });

    // ===== Add Trigger =====
    addTriggerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (!supabaseClient) return showToast("Supabase belum terkonfigurasi!", "error");
        var key = document.getElementById("trigger-key").value.trim().toLowerCase();
        var value = document.getElementById("trigger-value").value.trim();
        var imageUrl = document.getElementById("trigger-image-url").value.trim() || null;
        supabaseClient.from("triggers").upsert({ key: key, value: value, image_url: imageUrl }).then(function(res) {
            if (res.error) throw res.error;
            showToast('Trigger "' + key + '" berhasil disimpan!');
            addTriggerForm.reset();
            bootstrap.Modal.getInstance(document.getElementById("addTriggerModal")).hide();
            fetchData();
        }).catch(function(err) {
            showToast("Gagal: " + err.message, "error");
        });
    });

    // ===== Edit Trigger =====
    function openEditModal(key) {
        var tr = allTriggers.find(function(t) { return t.key === key; });
        if (!tr) return;
        editOriginalKey.value = tr.key;
        editTriggerKey.value = tr.key;
        editTriggerValue.value = tr.value;
        document.getElementById("edit-trigger-image-url").value = tr.image_url || "";
        new bootstrap.Modal(document.getElementById("editTriggerModal")).show();
    }

    editTriggerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (!supabaseClient) return showToast("Supabase belum terkonfigurasi!", "error");
        var imageUrl = document.getElementById("edit-trigger-image-url").value.trim() || null;
        supabaseClient.from("triggers").update({ value: editTriggerValue.value.trim(), image_url: imageUrl }).eq("key", editOriginalKey.value).then(function(res) {
            if (res.error) throw res.error;
            showToast("Trigger berhasil diperbarui!");
            bootstrap.Modal.getInstance(document.getElementById("editTriggerModal")).hide();
            fetchData();
        }).catch(function(err) {
            showToast("Gagal: " + err.message, "error");
        });
    });

    // ===== Delete Trigger =====
    function deleteTrigger(key) {
        if (!supabaseClient) return showToast("Supabase belum terkonfigurasi!", "error");
        if (!confirm('Hapus trigger "' + key + '"?')) return;
        supabaseClient.from("triggers").delete().eq("key", key).then(function(res) {
            if (res.error) throw res.error;
            showToast('Trigger "' + key + '" dihapus!');
            fetchData();
        }).catch(function(err) {
            showToast("Gagal: " + err.message, "error");
        });
    }

    // ===== Boot =====
    setTheme(localStorage.getItem("theme") || "light");
    loadSupabaseConfig();

    console.log("[Bot Kucai Panel] Ready.");
});
