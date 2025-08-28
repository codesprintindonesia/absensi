--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 17.2

-- Started on 2025-08-28 16:46:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4594 (class 0 OID 26244)
-- Dependencies: 227
-- Data for Name: l_realisasi_lembur; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.l_realisasi_lembur (id, id_pegawai, periode_bulan_lembur, total_jam_lembur_bulanan, total_hari_terlambat_bulanan, rata_menit_keterlambatan, total_hari_tidak_hadir, total_hari_kerja_efektif, persentase_kehadiran, is_data_final, tanggal_finalisasi_data, difinalisasi_oleh, created_at, updated_at, nama_pegawai, kode_cabang, nama_cabang, id_divisi, nama_divisi, nama_jabatan_detail) FROM stdin;
LEM-PG001-202501	PG001	2025-01-01	0.00	1	45.00	0	23	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457	\N	\N	\N	\N	\N	\N
LEM-PG002-202501	PG002	2025-01-01	0.00	0	0.00	0	31	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457	\N	\N	\N	\N	\N	\N
LEM-PG003-202501	PG003	2025-01-01	1.00	1	90.00	0	22	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457	\N	\N	\N	\N	\N	\N
LEM-PG004-202501	PG004	2025-01-01	4.00	0	0.00	0	31	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457	\N	\N	\N	\N	\N	\N
LEM-PG005-202501	PG005	2025-01-01	0.00	0	0.00	0	31	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4586 (class 0 OID 25988)
-- Dependencies: 219
-- Data for Name: m_kebijakan_absensi; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_kebijakan_absensi (id, nama, kode_referensi, type_referensi, toleransi_keterlambatan, min_jam_kerja_full_day, aturan_potongan_terlambat, kebijakan_lembur_otomatis, jam_cut_off_hari, batas_radius_toleransi, is_default, is_aktif, created_at, updated_at) FROM stdin;
KBJ-0001	Kebijakan Umum Bank Sultra	\N	GLOBAL	15	8.00	\N	\N	23:59:59	0	t	t	2025-08-21 09:40:34.423857	2025-08-21 09:40:34.423857
KBJ-0002	Kebijakan Security	OPR	DIVISI	5	8.00	\N	\N	23:59:59	0	f	t	2025-08-21 09:40:34.423857	2025-08-21 09:40:34.423857
KBJ-0003	Kebijakan Mobile Worker	MOBILE	CUSTOM	30	7.50	\N	\N	23:59:59	0	f	t	2025-08-21 09:40:34.423857	2025-08-21 09:40:34.423857
\.


--
-- TOC entry 4582 (class 0 OID 25921)
-- Dependencies: 215
-- Data for Name: m_lokasi_kerja; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_lokasi_kerja (id, kode_referensi, type_lokasi, nama, alamat, latitude, longitude, radius, is_aktif, keterangan, created_at, updated_at) FROM stdin;
LOK-0001	000	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	-3.99449170	122.51325710	50	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0002	101	CABANG	Cabang Kendari	Jl. Ahmad Yani No.50, Kendari	-3.98500000	122.52000000	30	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0003	102	CABANG	Cabang Bau-Bau	Jl. Betoambari No.25, Bau-Bau	-5.48705360	122.62214390	30	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0004	SAMSAT_01	CUSTOM	Samsat Keliling Pasar Sentral	Pasar Sentral Kendari	-3.99000000	122.51000000	25	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0005	ATM_01	CUSTOM	Security ATM Mall Kendari	Mall Kendari, Lt.1	-3.99200000	122.51500000	20	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0016	116	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	-3.99449170	122.51325710	50	t	Kantor pusat dengan fasilitas lengkap	2025-08-27 10:31:56.096	2025-08-27 10:31:56.096
LOK-0006	103	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	\N	\N	50	t	Kantor pusat dengan fasilitas lengkap	2025-08-26 09:06:32.002	2025-08-26 09:06:32.002
LOK-0007	107	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	\N	\N	50	t	Kantor pusat dengan fasilitas lengkap	2025-08-26 09:47:56.859	2025-08-26 09:47:56.859
LOK-0008	108	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	\N	\N	50	t	Kantor pusat dengan fasilitas lengkap	2025-08-26 10:08:50.643	2025-08-26 10:08:50.643
LOK-0009	109	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	\N	\N	50	t	Kantor pusat dengan fasilitas lengkap	2025-08-26 10:31:09.626	2025-08-26 10:31:09.626
LOK-0010	110	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	\N	\N	50	t	Kantor pusat dengan fasilitas lengkap	2025-08-26 10:34:01.564	2025-08-26 10:34:01.564
LOK-0012	112	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	-3.99449170	122.51325710	50	t	Kantor pusat dengan fasilitas lengkap	2025-08-26 14:28:00.584	2025-08-26 14:28:00.584
\.


--
-- TOC entry 4584 (class 0 OID 25954)
-- Dependencies: 217
-- Data for Name: m_shift_group; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_shift_group (id, nama, durasi_rotasi_minggu, keterangan, is_aktif, created_at, updated_at) FROM stdin;
GRP-0001	Security Rotasi 3 Minggu	3	Rotasi security setiap 3 minggu: Pagi -> Siang -> Malam	t	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002	Security Pattern 2-2-2	1	Pattern security 2 hari: P,P,S,S,M,M kemudian repeat	t	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
\.


--
-- TOC entry 4585 (class 0 OID 25966)
-- Dependencies: 218
-- Data for Name: m_shift_group_detail; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_shift_group_detail (id, id_shift_group, id_shift_kerja, hari_dalam_minggu, urutan_minggu, created_at, updated_at) FROM stdin;
GRP-0001-D01	GRP-0001	SHF-0003	1	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D02	GRP-0001	SHF-0003	2	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D03	GRP-0001	SHF-0003	3	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D04	GRP-0001	SHF-0003	4	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D05	GRP-0001	SHF-0003	5	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D06	GRP-0001	SHF-0003	6	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D07	GRP-0001	SHF-0003	7	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D08	GRP-0001	SHF-0004	1	2	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D09	GRP-0001	SHF-0004	2	2	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D10	GRP-0001	SHF-0004	3	2	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D11	GRP-0001	SHF-0004	4	2	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D12	GRP-0001	SHF-0004	5	2	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D13	GRP-0001	SHF-0004	6	2	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D14	GRP-0001	SHF-0004	7	2	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D15	GRP-0001	SHF-0005	1	3	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D16	GRP-0001	SHF-0005	2	3	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D17	GRP-0001	SHF-0005	3	3	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D18	GRP-0001	SHF-0005	4	3	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D19	GRP-0001	SHF-0005	5	3	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D20	GRP-0001	SHF-0005	6	3	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0001-D21	GRP-0001	SHF-0005	7	3	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002-D01	GRP-0002	SHF-0003	1	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002-D02	GRP-0002	SHF-0003	2	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002-D03	GRP-0002	SHF-0004	3	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002-D04	GRP-0002	SHF-0004	4	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002-D05	GRP-0002	SHF-0005	5	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002-D06	GRP-0002	SHF-0005	6	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002-D07	GRP-0002	SHF-0003	7	1	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
\.


--
-- TOC entry 4583 (class 0 OID 25936)
-- Dependencies: 216
-- Data for Name: m_shift_kerja; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_shift_kerja (id, kode_shift, nama, jam_masuk, jam_pulang, durasi_istirahat, hari_kerja, jenis_shift, is_umum, toleransi_keterlambatan, keterangan, is_aktif, created_at, updated_at) FROM stdin;
SHF-0001	NORMAL	Shift Normal Kantor	08:00:00	17:00:00	60	[1, 2, 3, 4, 5]	NORMAL	t	15	\N	t	2025-08-20 15:03:04.025092	2025-08-20 15:03:04.025092
SHF-0002	CABANG	Shift Cabang	08:00:00	16:00:00	60	[1, 2, 3, 4, 5, 6]	NORMAL	f	10	\N	t	2025-08-20 15:03:04.025092	2025-08-20 15:03:04.025092
SHF-0003	SEC_PAGI	Security Shift Pagi	06:00:00	14:00:00	60	[1, 2, 3, 4, 5, 6, 7]	ROTATING	f	5	\N	t	2025-08-20 15:03:04.025092	2025-08-20 15:03:04.025092
SHF-0004	SEC_SIANG	Security Shift Siang	14:00:00	22:00:00	60	[1, 2, 3, 4, 5, 6, 7]	ROTATING	f	5	\N	t	2025-08-20 15:03:04.025092	2025-08-20 15:03:04.025092
SHF-0005	SEC_MALAM	Security Shift Malam	22:00:00	06:00:00	60	[1, 2, 3, 4, 5, 6, 7]	ROTATING	f	5	\N	t	2025-08-20 15:03:04.025092	2025-08-20 15:03:04.025092
SHF-0006	MOBILE	Shift Mobile/Lapangan	07:00:00	15:00:00	60	[1, 2, 3, 4, 5]	CUSTOM	f	30	\N	t	2025-08-20 15:03:04.025092	2025-08-20 15:03:04.025092
\.


--
-- TOC entry 4587 (class 0 OID 26008)
-- Dependencies: 220
-- Data for Name: r_hari_libur; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.r_hari_libur (tanggal, nama_libur, jenis_libur, keterangan, created_at, updated_at) FROM stdin;
2025-01-25	Sabtu Libur Bank	LIBUR_DAERAH	Libur khusus bank untuk staff kantoran	2025-08-21 09:18:17.094267	2025-08-21 09:18:17.094267
2025-01-26	Minggu	LIBUR_DAERAH	Libur mingguan	2025-08-21 09:18:17.094267	2025-08-21 09:18:17.094267
2025-02-12	Tahun Baru Imlek	LIBUR_NASIONAL	Hari libur nasional	2025-08-21 09:18:17.094267	2025-08-21 09:18:17.094267
\.


--
-- TOC entry 4595 (class 0 OID 26275)
-- Dependencies: 228
-- Data for Name: s_audit_log; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.s_audit_log (id, nama_tabel, id_record, jenis_aksi, data_lama, data_baru, id_user_pelaku, alamat_ip, user_agent_info, alasan_perubahan, created_at) FROM stdin;
AUD-20250124143000-001	t_absensi_harian	ABS-PG001-20250123	UPDATE	{"jam_masuk_aktual": "08:45:00", "status_kehadiran": "Terlambat", "menit_keterlambatan": 45}	{"jam_masuk_aktual": "08:00:00", "status_kehadiran": "Hadir", "menit_keterlambatan": 0}	PG001	192.168.1.100	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36	Koreksi absensi disetujui atasan	2025-08-21 09:48:08.77502
AUD-20250124160000-001	t_shift_harian_pegawai	JDW-PG002-20250125	UPDATE	{"jenis_perubahan": "NORMAL", "id_shift_kerja_aktual": null, "id_shift_kerja_jadwal": "SHF-0005"}	{"jenis_perubahan": "TUKAR_SHIFT", "id_shift_kerja_aktual": "SHF-0003", "id_shift_kerja_jadwal": "SHF-0005"}	PG001	192.168.1.101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36	Persetujuan tukar shift security	2025-08-21 09:48:08.77502
AUD-20250125063000-001	t_shift_harian_pegawai	JDW-PG003-20250125	INSERT	\N	{"id_pegawai": "PG003", "tanggal_kerja": "2025-01-25", "jenis_perubahan": "PENUGASAN_KHUSUS"}	PG001	192.168.1.102	Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)	Emergency assignment approval	2025-08-21 09:48:08.77502
AUD-20250123220000-001	t_absensi_harian	ABS-PG004-20250123	UPDATE	{"jam_pulang_aktual": "22:00:00", "jam_lembur_dihitung": 0, "is_shift_lintas_hari": false}	{"jam_pulang_aktual": "02:00:00", "jam_lembur_dihitung": 4.00, "is_shift_lintas_hari": true}	PG001	192.168.1.103	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36	Approve extreme overtime - emergency maintenance	2025-08-21 09:48:08.77502
\.


--
-- TOC entry 4596 (class 0 OID 26284)
-- Dependencies: 229
-- Data for Name: s_proses_harian; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.s_proses_harian (id, tanggal_proses, jenis_proses, status_proses, waktu_mulai, waktu_selesai, total_data_diproses, jumlah_success, jumlah_error, detail_error, catatan, created_at) FROM stdin;
PRC-20250122-001	2025-01-22	REKONSILIASI	SUCCESS	2025-01-23 02:00:00	2025-01-23 02:15:00	16	16	0	\N	Rekonsiliasi log absensi berhasil untuk 4 pegawai	2025-08-21 09:48:08.77502
PRC-20250122-002	2025-01-22	VALIDASI	SUCCESS	2025-01-23 02:15:00	2025-01-23 02:18:00	16	16	0	\N	Validasi geofencing semua log berhasil	2025-08-21 09:48:08.77502
PRC-20250122-003	2025-01-22	BACKUP	SUCCESS	2025-01-23 03:00:00	2025-01-23 03:45:00	1	1	0	\N	Backup database harian berhasil	2025-08-21 09:48:08.77502
PRC-20250123-001	2025-01-23	SYNC_API	PARTIAL	2025-01-24 01:00:00	2025-01-24 01:30:00	5	4	1	\N	Sync ke payroll berhasil 4 dari 5 pegawai. Error pada PG004 karena lembur extreme.	2025-08-21 09:48:08.77502
\.


--
-- TOC entry 4592 (class 0 OID 26150)
-- Dependencies: 225
-- Data for Name: t_absensi_harian; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_absensi_harian (id, id_pegawai, tanggal_absensi, id_shift_kerja, id_lokasi_kerja_digunakan, jam_masuk_jadwal, jam_pulang_jadwal, jam_masuk_aktual, jam_keluar_istirahat_aktual, jam_masuk_istirahat_aktual, jam_pulang_aktual, id_log_masuk, id_log_keluar_istirahat, id_log_masuk_istirahat, id_log_pulang, status_kehadiran, menit_keterlambatan, menit_pulang_cepat, total_jam_kerja_efektif, jam_lembur_dihitung, tanggal_kerja_efektif, is_shift_lintas_hari, id_kebijakan_absensi, catatan_khusus, is_data_final, difinalisasi_oleh, tanggal_finalisasi, created_at, updated_at, nama_pegawai, kode_cabang, nama_cabang, id_divisi, nama_divisi, nama_jabatan_detail) FROM stdin;
ABS-PG001-20250122	PG001	2025-01-22	SHF-0001	LOK-0001	08:00:00	17:00:00	07:58:00	12:00:00	13:00:00	17:03:00	LOG-PG001-20250122075800	LOG-PG001-20250122120000	LOG-PG001-20250122130000	LOG-PG001-20250122170300	Hadir	0	0	8.05	0.00	2025-01-22	f	KBJ-0001	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283	\N	\N	\N	\N	\N	\N
ABS-PG002-20250121	PG002	2025-01-21	SHF-0005	LOK-0001	22:00:00	06:00:00	21:58:00	02:00:00	02:30:00	06:05:00	LOG-PG002-20250121215800	LOG-PG002-20250122020000	LOG-PG002-20250122023000	LOG-PG002-20250122060500	Hadir	0	0	7.62	0.00	2025-01-21	t	KBJ-0002	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283	\N	\N	\N	\N	\N	\N
ABS-PG003-20250122	PG003	2025-01-22	SHF-0006	LOK-0004	07:00:00	15:00:00	06:55:00	11:30:00	12:30:00	15:08:00	LOG-PG003-20250122065500	LOG-PG003-20250122113000	LOG-PG003-20250122123000	LOG-PG003-20250122150800	Hadir	0	0	7.72	0.00	2025-01-22	f	KBJ-0003	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283	\N	\N	\N	\N	\N	\N
ABS-PG004-20250122	PG004	2025-01-22	SHF-0004	LOK-0001	14:00:00	22:00:00	13:55:00	18:00:00	18:30:00	22:03:00	LOG-PG004-20250122135500	LOG-PG004-20250122180000	LOG-PG004-20250122183000	LOG-PG004-20250122220300	Hadir	0	0	7.63	0.00	2025-01-22	f	KBJ-0002	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283	\N	\N	\N	\N	\N	\N
ABS-PG001-20250123	PG001	2025-01-23	SHF-0001	LOK-0001	08:00:00	17:00:00	08:45:00	\N	\N	17:20:00	LOG-PG001-20250123084500	\N	\N	LOG-PG001-20250123172000	Terlambat	45	0	7.58	0.00	2025-01-23	f	KBJ-0001	\N	f	\N	\N	2025-08-21 09:41:38.080612	2025-08-21 09:41:38.080612	\N	\N	\N	\N	\N	\N
ABS-PG003-20250125	PG003	2025-01-25	SHF-0006	LOK-0003	07:00:00	15:00:00	08:30:00	\N	\N	16:00:00	LOG-PG003-20250125083000	\N	\N	LOG-PG003-20250125160000	Hadir	90	0	6.50	1.00	2025-01-25	f	KBJ-0003	Emergency assignment di Cabang Bau-Bau untuk maintenance ATM. Keterlambatan karena perjalanan jauh dan kondisi emergency.	f	\N	\N	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N	\N	\N
ABS-PG004-20250123	PG004	2025-01-23	SHF-0004	LOK-0001	14:00:00	22:00:00	13:58:00	18:00:00	18:30:00	02:00:00	LOG-PG004-20250123135800	LOG-PG004-20250123180000	LOG-PG004-20250123183000	LOG-PG004-20250124020000	Hadir	0	0	11.50	4.00	2025-01-23	t	KBJ-0002	Lembur emergency maintenance sistem keamanan sampai dini hari. Shift siang extended menjadi lintas hari.	f	\N	\N	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4593 (class 0 OID 26217)
-- Dependencies: 226
-- Data for Name: t_koreksi_absensi; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_koreksi_absensi (id, id_absensi_harian, id_pegawai_pemohon, tanggal_pengajuan, jenis_koreksi, alasan, data_lama, data_usulan, path_dokumen_pendukung, status, id_atasan_penyetuju, tanggal_approval, catatan_atasan, created_at, updated_at, nama_pegawai_pemohon, nama_atasan_penyetuju, kode_cabang, nama_cabang, nama_jabatan_detail) FROM stdin;
KOR-PG001-20250124	ABS-PG001-20250123	PG001	2025-01-24 09:30:00	JAM_MASUK	Terlambat karena macet parah akibat kecelakaan di Jalan Ahmad Yani. Saya sudah berusaha berangkat lebih awal namun tetap terjebak macet selama 1 jam lebih.	{"jam_masuk_aktual": "08:45:00", "status_kehadiran": "Terlambat", "menit_keterlambatan": 45}	{"jam_masuk_aktual": "08:00:00", "status_kehadiran": "Hadir", "menit_keterlambatan": 0}	\N	APPROVED	PG001	2025-01-24 14:15:00	Disetujui karena memang terjadi kecelakaan yang menyebabkan macet total. Untuk kedepan harap berangkat lebih awal jika ada prediksi kemacetan.	2025-08-21 09:43:10.583637	2025-08-21 09:43:10.583637	\N	\N	\N	\N	\N
\.


--
-- TOC entry 4591 (class 0 OID 26127)
-- Dependencies: 224
-- Data for Name: t_log_raw_absensi; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_log_raw_absensi (id, id_pegawai, waktu_log, source_absensi, id_device, koordinat_gps, id_lokasi_kerja, is_validasi_geofence, jarak_dari_lokasi, akurasi_gps, path_bukti_foto, qr_hash, keterangan_log, status_validasi, created_at, updated_at, nama_pegawai, kode_cabang, nama_cabang, nama_jabatan_detail) FROM stdin;
LOG-PG001-20250122075800	PG001	2025-01-22 07:58:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	15.50	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG001-20250122120000	PG001	2025-01-22 12:00:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	12.00	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG001-20250122130000	PG001	2025-01-22 13:00:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	12.00	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG001-20250122170300	PG001	2025-01-22 17:03:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	15.50	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG002-20250121215800	PG002	2025-01-21 21:58:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250121_215800.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG002-20250122020000	PG002	2025-01-22 02:00:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250122_020000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG002-20250122023000	PG002	2025-01-22 02:30:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250122_023000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG002-20250122060500	PG002	2025-01-22 06:05:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250122_060500.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG003-20250122065500	PG003	2025-01-22 06:55:00	2	PHONE_CITRA_IPHONE	-3.9900000,122.5100000	LOK-0004	t	18.70	5.20	/uploads/selfie_citra_20250122_065500.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG003-20250122113000	PG003	2025-01-22 11:30:00	2	PHONE_CITRA_IPHONE	-3.9901000,122.5101000	LOK-0004	t	20.10	6.10	/uploads/selfie_citra_20250122_113000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG003-20250122123000	PG003	2025-01-22 12:30:00	2	PHONE_CITRA_IPHONE	-3.9901000,122.5101000	LOK-0004	t	20.10	6.10	/uploads/selfie_citra_20250122_123000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG003-20250122150800	PG003	2025-01-22 15:08:00	2	PHONE_CITRA_IPHONE	-3.9900500,122.5100500	LOK-0004	t	19.20	5.80	/uploads/selfie_citra_20250122_150800.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG004-20250122135500	PG004	2025-01-22 13:55:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_135500.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG004-20250122180000	PG004	2025-01-22 18:00:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_180000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG004-20250122183000	PG004	2025-01-22 18:30:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_183000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG004-20250122220300	PG004	2025-01-22 22:03:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_220300.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995	\N	\N	\N	\N
LOG-PG001-20250123084500	PG001	2025-01-23 08:45:00	2	PHONE_AHMAD_SAMSUNG	-3.9944917,122.5132571	LOK-0001	t	18.20	6.50	\N	\N	\N	VALID	2025-08-21 09:41:38.080612	2025-08-21 09:41:38.080612	\N	\N	\N	\N
LOG-PG001-20250123172000	PG001	2025-01-23 17:20:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	12.00	3.00	\N	\N	\N	VALID	2025-08-21 09:41:38.080612	2025-08-21 09:41:38.080612	\N	\N	\N	\N
LOG-PG003-20250125083000	PG003	2025-01-25 08:30:00	2	PHONE_CITRA_IPHONE	-5.4870536,122.6221439	LOK-0003	t	22.50	8.20	/uploads/selfie_citra_20250125_083000.jpg	\N	Emergency assignment - ATM maintenance	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N
LOG-PG003-20250125160000	PG003	2025-01-25 16:00:00	2	PHONE_CITRA_IPHONE	-5.4870536,122.6221439	LOK-0003	t	22.50	8.20	/uploads/selfie_citra_20250125_160000.jpg	\N	Emergency assignment completed	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N
LOG-PG004-20250123135800	PG004	2025-01-23 13:58:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250123_135800.jpg	\N	Shift siang normal	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N
LOG-PG004-20250123180000	PG004	2025-01-23 18:00:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250123_180000.jpg	\N	Istirahat siang	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N
LOG-PG004-20250123183000	PG004	2025-01-23 18:30:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250123_183000.jpg	\N	Selesai istirahat	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N
LOG-PG004-20250124020000	PG004	2025-01-24 02:00:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250124_020000.jpg	\N	Lembur sampai dini hari - emergency maintenance	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171	\N	\N	\N	\N
\.


--
-- TOC entry 4588 (class 0 OID 26018)
-- Dependencies: 221
-- Data for Name: t_pegawai_lokasi_kerja; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_pegawai_lokasi_kerja (id, id_pegawai, id_lokasi_kerja, id_shift_kerja, tanggal_mulai_berlaku, tanggal_akhir_berlaku, jenis_penugasan, prioritas_lokasi, is_lokasi_utama, keterangan, disetujui_oleh, tanggal_persetujuan, status_persetujuan, is_aktif, created_at, updated_at) FROM stdin;
PLK-PG001-20250101-001	PG001	LOK-0001	SHF-0001	2025-01-01	\N	REGULAR	1	t	Lokasi kerja utama di Kantor Pusat	\N	\N	APPROVED	t	2025-08-21 09:28:40.564392	2025-08-21 09:28:40.564392
PLK-PG002-20250101-001	PG002	LOK-0001	\N	2025-01-01	\N	REGULAR	1	t	Security Kantor Pusat - Shift Rotating 3 Minggu	\N	\N	APPROVED	t	2025-08-21 09:28:40.564392	2025-08-21 09:28:40.564392
PLK-PG003-20250101-001	PG003	LOK-0002	SHF-0006	2025-01-01	\N	REGULAR	1	t	Lokasi utama Cabang Kendari	\N	\N	APPROVED	t	2025-08-21 09:28:40.564392	2025-08-21 09:28:40.564392
PLK-PG003-20250120-001	PG003	LOK-0004	SHF-0006	2025-01-20	2025-01-31	SPECIAL_DUTY	2	f	Penugasan khusus samsat keliling januari	\N	\N	APPROVED	t	2025-08-21 09:28:40.564392	2025-08-21 09:28:40.564392
PLK-PG003-20250101-002	PG003	LOK-0003	SHF-0006	2025-01-01	\N	EMERGENCY	3	f	Backup lokasi untuk emergency	\N	\N	APPROVED	t	2025-08-21 09:28:40.564392	2025-08-21 09:28:40.564392
PLK-PG004-20250101-001	PG004	LOK-0001	\N	2025-01-01	\N	REGULAR	1	t	Security Kantor Pusat - Pattern 2-2-2	\N	\N	APPROVED	t	2025-08-21 09:28:40.564392	2025-08-21 09:28:40.564392
PLK-PG005-20250101-001	PG005	LOK-0001	\N	2025-01-01	\N	REGULAR	1	t	\N	\N	\N	APPROVED	t	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
\.


--
-- TOC entry 4590 (class 0 OID 26082)
-- Dependencies: 223
-- Data for Name: t_shift_harian_pegawai; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_shift_harian_pegawai (id, id_pegawai, tanggal_kerja, id_shift_kerja_jadwal, id_shift_kerja_aktual, id_lokasi_kerja_aktual, jenis_perubahan, id_pegawai_pengganti, alasan_perubahan, disetujui_oleh, tanggal_persetujuan, status_persetujuan, created_at, updated_at) FROM stdin;
JDW-PG001-20250120	PG001	2025-01-20	SHF-0001	SHF-0001	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG001-20250121	PG001	2025-01-21	SHF-0001	SHF-0001	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG001-20250122	PG001	2025-01-22	SHF-0001	SHF-0001	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG001-20250123	PG001	2025-01-23	SHF-0001	SHF-0001	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG001-20250124	PG001	2025-01-24	SHF-0001	SHF-0001	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG002-20250120	PG002	2025-01-20	SHF-0005	SHF-0005	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG002-20250121	PG002	2025-01-21	SHF-0005	SHF-0005	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG002-20250122	PG002	2025-01-22	SHF-0005	SHF-0005	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG002-20250123	PG002	2025-01-23	SHF-0005	SHF-0005	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG002-20250124	PG002	2025-01-24	SHF-0005	SHF-0005	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG003-20250120	PG003	2025-01-20	SHF-0006	SHF-0006	LOK-0002	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG003-20250121	PG003	2025-01-21	SHF-0006	SHF-0006	LOK-0004	PENUGASAN_KHUSUS	\N	Penugasan samsat keliling	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG003-20250122	PG003	2025-01-22	SHF-0006	SHF-0006	LOK-0004	PENUGASAN_KHUSUS	\N	Penugasan samsat keliling	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG003-20250123	PG003	2025-01-23	SHF-0006	SHF-0006	LOK-0002	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG003-20250124	PG003	2025-01-24	SHF-0006	SHF-0006	LOK-0003	PENUGASAN_KHUSUS	\N	Emergency support Cabang Bau-Bau	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG004-20250120	PG004	2025-01-20	SHF-0003	SHF-0003	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG004-20250121	PG004	2025-01-21	SHF-0003	SHF-0003	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG004-20250122	PG004	2025-01-22	SHF-0004	SHF-0004	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG004-20250123	PG004	2025-01-23	SHF-0004	SHF-0004	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG004-20250124	PG004	2025-01-24	SHF-0005	SHF-0005	LOK-0001	NORMAL	\N	\N	\N	\N	APPROVED	2025-08-21 09:29:43.11435	2025-08-21 09:29:43.11435
JDW-PG002-20250125	PG002	2025-01-25	SHF-0005	SHF-0003	LOK-0001	TUKAR_SHIFT	PG005	Tukar shift dengan Dedi karena ada keperluan keluarga mendesak	PG001	2025-01-24 16:00:00	APPROVED	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
JDW-PG005-20250125	PG005	2025-01-25	SHF-0003	SHF-0005	LOK-0001	TUKAR_SHIFT	PG002	Tukar shift dengan Budi	PG001	2025-01-24 16:00:00	APPROVED	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
JDW-PG003-20250125	PG003	2025-01-25	SHF-0006	SHF-0006	LOK-0003	PENUGASAN_KHUSUS	\N	Emergency: ATM Cabang Bau-Bau bermasalah, perlu maintenance mobile banking integration	PG001	2025-01-25 06:30:00	APPROVED	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
\.


--
-- TOC entry 4589 (class 0 OID 26057)
-- Dependencies: 222
-- Data for Name: t_shift_pegawai; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_shift_pegawai (id, id_pegawai, id_shift_kerja, id_shift_group, tanggal_mulai, tanggal_akhir, is_aktif, created_at, updated_at) FROM stdin;
ASG-PG001-202501	PG001	SHF-0001	\N	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG002-202501	PG002	\N	GRP-0001	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG003-202501	PG003	SHF-0006	\N	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG004-202501	PG004	\N	GRP-0002	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG005-202501	PG005	\N	GRP-0001	2025-01-01	\N	t	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
\.


-- Completed on 2025-08-28 16:46:00

--
-- PostgreSQL database dump complete
--

