--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 17.2

-- Started on 2025-08-21 16:50:42

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
-- TOC entry 6 (class 2615 OID 25907)
-- Name: absensi; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA absensi;


ALTER SCHEMA absensi OWNER TO postgres;

--
-- TOC entry 231 (class 1255 OID 26320)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: absensi; Owner: postgres
--

CREATE FUNCTION absensi.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION absensi.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 26244)
-- Name: l_realisasi_lembur; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.l_realisasi_lembur (
    id character varying(20) NOT NULL,
    id_pegawai character varying(10) NOT NULL,
    periode_bulan_lembur date NOT NULL,
    total_jam_lembur_bulanan numeric(6,2) NOT NULL,
    total_hari_terlambat_bulanan integer DEFAULT 0,
    rata_menit_keterlambatan numeric(5,2) DEFAULT 0,
    total_hari_tidak_hadir integer DEFAULT 0,
    total_hari_kerja_efektif integer DEFAULT 0,
    persentase_kehadiran numeric(5,2) DEFAULT 0,
    is_data_final boolean DEFAULT false,
    tanggal_finalisasi_data timestamp without time zone,
    difinalisasi_oleh character varying(10),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT l_realisasi_lembur_persentase_kehadiran_check CHECK (((persentase_kehadiran >= (0)::numeric) AND (persentase_kehadiran <= (100)::numeric))),
    CONSTRAINT l_realisasi_lembur_rata_menit_keterlambatan_check CHECK ((rata_menit_keterlambatan >= (0)::numeric)),
    CONSTRAINT l_realisasi_lembur_total_hari_kerja_efektif_check CHECK ((total_hari_kerja_efektif >= 0)),
    CONSTRAINT l_realisasi_lembur_total_hari_terlambat_bulanan_check CHECK ((total_hari_terlambat_bulanan >= 0)),
    CONSTRAINT l_realisasi_lembur_total_hari_tidak_hadir_check CHECK ((total_hari_tidak_hadir >= 0)),
    CONSTRAINT l_realisasi_lembur_total_jam_lembur_bulanan_check CHECK ((total_jam_lembur_bulanan >= (0)::numeric))
);


ALTER TABLE absensi.l_realisasi_lembur OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25988)
-- Name: m_kebijakan_absensi; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.m_kebijakan_absensi (
    id character varying(8) NOT NULL,
    nama character varying(100) NOT NULL,
    kode_referensi character varying(20),
    type_referensi character varying(20) DEFAULT 'GLOBAL'::character varying,
    toleransi_keterlambatan integer DEFAULT 15,
    min_jam_kerja_full_day numeric(4,2) DEFAULT 8.00,
    aturan_potongan_terlambat jsonb,
    kebijakan_lembur_otomatis jsonb,
    jam_cut_off_hari time without time zone DEFAULT '23:59:59'::time without time zone,
    batas_radius_toleransi integer DEFAULT 0,
    is_default boolean DEFAULT false,
    is_aktif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT m_kebijakan_absensi_batas_radius_toleransi_check CHECK ((batas_radius_toleransi >= 0)),
    CONSTRAINT m_kebijakan_absensi_min_jam_kerja_full_day_check CHECK ((min_jam_kerja_full_day > (0)::numeric)),
    CONSTRAINT m_kebijakan_absensi_toleransi_keterlambatan_check CHECK ((toleransi_keterlambatan >= 0)),
    CONSTRAINT m_kebijakan_absensi_type_referensi_check CHECK (((type_referensi)::text = ANY (ARRAY['CABANG'::text, 'DIVISI'::text, 'UNIT_KERJA'::text, 'GLOBAL'::text, 'CUSTOM'::text])))
);


ALTER TABLE absensi.m_kebijakan_absensi OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 25921)
-- Name: m_lokasi_kerja; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.m_lokasi_kerja (
    id character varying(8) NOT NULL,
    kode_referensi character varying(20) NOT NULL,
    type_lokasi character varying(20) NOT NULL,
    nama character varying(100) NOT NULL,
    alamat text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    radius integer DEFAULT 20,
    is_aktif boolean DEFAULT true,
    keterangan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT m_lokasi_kerja_radius_check CHECK (((radius > 0) AND (radius <= 1000))),
    CONSTRAINT m_lokasi_kerja_type_lokasi_check CHECK (((type_lokasi)::text = ANY ((ARRAY['CABANG'::character varying, 'DIVISI'::character varying, 'UNIT_KERJA'::character varying, 'CUSTOM'::character varying, 'MOBILE'::character varying])::text[])))
);


ALTER TABLE absensi.m_lokasi_kerja OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 25908)
-- Name: m_pegawai_absensi; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.m_pegawai_absensi (
    id_pegawai character varying(10) NOT NULL,
    nama_pegawai character varying(100) NOT NULL,
    email character varying(100),
    id_cabang character varying(3) NOT NULL,
    nama_cabang character varying(100) NOT NULL,
    id_divisi character varying(10) NOT NULL,
    nama_divisi character varying(100) NOT NULL,
    id_bagian character varying(4),
    nama_bagian character varying(100),
    id_unit_kerja character varying(6),
    nama_unit_kerja character varying(100),
    status character varying(10) NOT NULL,
    is_aktif boolean DEFAULT true,
    path_foto_master character varying(255),
    last_sync_api timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT m_pegawai_absensi_status_check CHECK (((status)::text = ANY ((ARRAY['A'::character varying, 'N'::character varying, 'P'::character varying, 'R'::character varying])::text[])))
);


ALTER TABLE absensi.m_pegawai_absensi OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 25954)
-- Name: m_shift_group; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.m_shift_group (
    id character varying(8) NOT NULL,
    nama character varying(100) NOT NULL,
    durasi_rotasi_minggu integer DEFAULT 1,
    keterangan text,
    is_aktif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT m_shift_group_durasi_rotasi_minggu_check CHECK ((durasi_rotasi_minggu > 0))
);


ALTER TABLE absensi.m_shift_group OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25966)
-- Name: m_shift_group_detail; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.m_shift_group_detail (
    id character varying(12) NOT NULL,
    id_shift_group character varying(8) NOT NULL,
    id_shift_kerja character varying(8) NOT NULL,
    hari_dalam_minggu smallint NOT NULL,
    urutan_minggu smallint DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT m_shift_group_detail_hari_dalam_minggu_check CHECK (((hari_dalam_minggu >= 1) AND (hari_dalam_minggu <= 7))),
    CONSTRAINT m_shift_group_detail_urutan_minggu_check CHECK ((urutan_minggu > 0))
);


ALTER TABLE absensi.m_shift_group_detail OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25936)
-- Name: m_shift_kerja; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.m_shift_kerja (
    id character varying(8) NOT NULL,
    kode_shift character varying(10) NOT NULL,
    nama character varying(50) NOT NULL,
    jam_masuk time without time zone NOT NULL,
    jam_pulang time without time zone NOT NULL,
    durasi_istirahat integer DEFAULT 60,
    hari_kerja jsonb NOT NULL,
    jenis_shift character varying(20) DEFAULT 'NORMAL'::character varying,
    is_umum boolean DEFAULT true,
    toleransi_keterlambatan integer DEFAULT 15,
    keterangan text,
    is_aktif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT m_shift_kerja_durasi_istirahat_check CHECK (((durasi_istirahat >= 0) AND (durasi_istirahat <= 240))),
    CONSTRAINT m_shift_kerja_jenis_shift_check CHECK (((jenis_shift)::text = ANY ((ARRAY['NORMAL'::character varying, 'ROTATING'::character varying, 'CUSTOM'::character varying])::text[])))
);


ALTER TABLE absensi.m_shift_kerja OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 26008)
-- Name: r_hari_libur; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.r_hari_libur (
    tanggal date NOT NULL,
    nama_libur character varying(100) NOT NULL,
    jenis_libur character varying(20) NOT NULL,
    keterangan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT r_hari_libur_jenis_libur_check CHECK (((jenis_libur)::text = ANY ((ARRAY['LIBUR_NASIONAL'::character varying, 'CUTI_BERSAMA'::character varying, 'LIBUR_DAERAH'::character varying])::text[])))
);


ALTER TABLE absensi.r_hari_libur OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 26275)
-- Name: s_audit_log; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.s_audit_log (
    id character varying(25) NOT NULL,
    nama_tabel character varying(50) NOT NULL,
    id_record character varying(50) NOT NULL,
    jenis_aksi character varying(10) NOT NULL,
    data_lama jsonb,
    data_baru jsonb,
    id_user_pelaku character varying(10) NOT NULL,
    alamat_ip character varying(45),
    user_agent_info text,
    alasan_perubahan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT s_audit_log_jenis_aksi_check CHECK (((jenis_aksi)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::text[])))
);


ALTER TABLE absensi.s_audit_log OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 26284)
-- Name: s_proses_harian; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.s_proses_harian (
    id character varying(20) NOT NULL,
    tanggal_proses date NOT NULL,
    jenis_proses character varying(20) NOT NULL,
    status_proses character varying(20) NOT NULL,
    waktu_mulai timestamp without time zone NOT NULL,
    waktu_selesai timestamp without time zone,
    total_data_diproses integer DEFAULT 0,
    jumlah_success integer DEFAULT 0,
    jumlah_error integer DEFAULT 0,
    detail_error jsonb,
    catatan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT s_proses_harian_jenis_proses_check CHECK (((jenis_proses)::text = ANY ((ARRAY['REKONSILIASI'::character varying, 'VALIDASI'::character varying, 'FINALISASI'::character varying, 'BACKUP'::character varying, 'SYNC_API'::character varying])::text[]))),
    CONSTRAINT s_proses_harian_jumlah_error_check CHECK ((jumlah_error >= 0)),
    CONSTRAINT s_proses_harian_jumlah_success_check CHECK ((jumlah_success >= 0)),
    CONSTRAINT s_proses_harian_status_proses_check CHECK (((status_proses)::text = ANY ((ARRAY['RUNNING'::character varying, 'SUCCESS'::character varying, 'ERROR'::character varying, 'SKIPPED'::character varying, 'PARTIAL'::character varying])::text[]))),
    CONSTRAINT s_proses_harian_total_data_diproses_check CHECK ((total_data_diproses >= 0))
);


ALTER TABLE absensi.s_proses_harian OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 26150)
-- Name: t_absensi_harian; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.t_absensi_harian (
    id character varying(25) NOT NULL,
    id_pegawai character varying(10) NOT NULL,
    tanggal_absensi date NOT NULL,
    id_shift_kerja character varying(8) NOT NULL,
    id_lokasi_kerja_digunakan character varying(8),
    jam_masuk_jadwal time without time zone,
    jam_pulang_jadwal time without time zone,
    jam_masuk_aktual time without time zone,
    jam_keluar_istirahat_aktual time without time zone,
    jam_masuk_istirahat_aktual time without time zone,
    jam_pulang_aktual time without time zone,
    id_log_masuk character varying(25),
    id_log_keluar_istirahat character varying(25),
    id_log_masuk_istirahat character varying(25),
    id_log_pulang character varying(25),
    status_kehadiran character varying(20) NOT NULL,
    menit_keterlambatan integer DEFAULT 0,
    menit_pulang_cepat integer DEFAULT 0,
    total_jam_kerja_efektif numeric(4,2) DEFAULT 0,
    jam_lembur_dihitung numeric(4,2) DEFAULT 0,
    tanggal_kerja_efektif date NOT NULL,
    is_shift_lintas_hari boolean DEFAULT false,
    id_kebijakan_absensi character varying(8) NOT NULL,
    catatan_khusus text,
    is_data_final boolean DEFAULT false,
    difinalisasi_oleh character varying(10),
    tanggal_finalisasi timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT t_absensi_harian_jam_lembur_dihitung_check CHECK ((jam_lembur_dihitung >= (0)::numeric)),
    CONSTRAINT t_absensi_harian_menit_keterlambatan_check CHECK ((menit_keterlambatan >= 0)),
    CONSTRAINT t_absensi_harian_menit_pulang_cepat_check CHECK ((menit_pulang_cepat >= 0)),
    CONSTRAINT t_absensi_harian_status_kehadiran_check CHECK (((status_kehadiran)::text = ANY ((ARRAY['Hadir'::character varying, 'Cuti'::character varying, 'Izin'::character varying, 'Sakit'::character varying, 'SPPD'::character varying, 'Alpa'::character varying, 'Terlambat'::character varying, 'Pulang_Cepat'::character varying, 'WFH'::character varying])::text[]))),
    CONSTRAINT t_absensi_harian_total_jam_kerja_efektif_check CHECK ((total_jam_kerja_efektif >= (0)::numeric))
);


ALTER TABLE absensi.t_absensi_harian OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 26217)
-- Name: t_koreksi_absensi; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.t_koreksi_absensi (
    id character varying(18) NOT NULL,
    id_absensi_harian character varying(18) NOT NULL,
    id_pegawai_pemohon character varying(10) NOT NULL,
    tanggal_pengajuan timestamp without time zone NOT NULL,
    jenis_koreksi character varying(20) NOT NULL,
    alasan text NOT NULL,
    data_lama jsonb,
    data_usulan jsonb NOT NULL,
    path_dokumen_pendukung character varying(255),
    status character varying(20) DEFAULT 'PENDING'::character varying,
    id_atasan_penyetuju character varying(10),
    tanggal_approval timestamp without time zone,
    catatan_atasan text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT t_koreksi_absensi_jenis_koreksi_check CHECK (((jenis_koreksi)::text = ANY ((ARRAY['JAM_MASUK'::character varying, 'JAM_PULANG'::character varying, 'STATUS_KEHADIRAN'::character varying, 'LOKASI'::character varying, 'LAINNYA'::character varying])::text[]))),
    CONSTRAINT t_koreksi_absensi_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE absensi.t_koreksi_absensi OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 26127)
-- Name: t_log_raw_absensi; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.t_log_raw_absensi (
    id character varying(25) NOT NULL,
    id_pegawai character varying(10) NOT NULL,
    waktu_log timestamp without time zone NOT NULL,
    source_absensi character varying(1) NOT NULL,
    id_device character varying(50),
    koordinat_gps character varying(50),
    id_lokasi_kerja character varying(8),
    is_validasi_geofence boolean DEFAULT false,
    jarak_dari_lokasi numeric(10,2),
    akurasi_gps numeric(8,2),
    path_bukti_foto character varying(255),
    qr_hash character varying(255),
    keterangan_log text,
    status_validasi character varying(15) DEFAULT 'VALID'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT t_log_raw_absensi_source_absensi_check CHECK (((source_absensi)::text = ANY ((ARRAY['1'::character varying, '2'::character varying, '3'::character varying])::text[]))),
    CONSTRAINT t_log_raw_absensi_status_validasi_check CHECK (((status_validasi)::text = ANY ((ARRAY['VALID'::character varying, 'INVALID'::character varying, 'SUSPICIOUS'::character varying, 'UNDER_REVIEW'::character varying])::text[])))
);


ALTER TABLE absensi.t_log_raw_absensi OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 26018)
-- Name: t_pegawai_lokasi_kerja; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.t_pegawai_lokasi_kerja (
    id character varying(25) NOT NULL,
    id_pegawai character varying(10) NOT NULL,
    id_lokasi_kerja character varying(8) NOT NULL,
    id_shift_kerja character varying(8),
    tanggal_mulai_berlaku date NOT NULL,
    tanggal_akhir_berlaku date,
    jenis_penugasan character varying(20) DEFAULT 'REGULAR'::character varying,
    prioritas_lokasi integer DEFAULT 1,
    is_lokasi_utama boolean DEFAULT false,
    keterangan text,
    disetujui_oleh character varying(10),
    tanggal_persetujuan timestamp without time zone,
    status_persetujuan character varying(15) DEFAULT 'APPROVED'::character varying,
    is_aktif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_prioritas_utama CHECK ((NOT ((is_lokasi_utama = true) AND (prioritas_lokasi > 1)))),
    CONSTRAINT check_tanggal_berlaku CHECK (((tanggal_akhir_berlaku IS NULL) OR (tanggal_akhir_berlaku >= tanggal_mulai_berlaku))),
    CONSTRAINT t_pegawai_lokasi_kerja_jenis_penugasan_check CHECK (((jenis_penugasan)::text = ANY ((ARRAY['REGULAR'::character varying, 'TEMPORARY'::character varying, 'EMERGENCY'::character varying, 'SPECIAL_DUTY'::character varying, 'PROJECT_BASED'::character varying])::text[]))),
    CONSTRAINT t_pegawai_lokasi_kerja_prioritas_lokasi_check CHECK ((prioritas_lokasi > 0)),
    CONSTRAINT t_pegawai_lokasi_kerja_status_persetujuan_check CHECK (((status_persetujuan)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE absensi.t_pegawai_lokasi_kerja OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 26082)
-- Name: t_shift_harian_pegawai; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.t_shift_harian_pegawai (
    id character varying(18) NOT NULL,
    id_pegawai character varying(10) NOT NULL,
    tanggal_kerja date NOT NULL,
    id_shift_kerja_jadwal character varying(8) NOT NULL,
    id_shift_kerja_aktual character varying(8),
    id_lokasi_kerja_aktual character varying(8),
    jenis_perubahan character varying(20) DEFAULT 'NORMAL'::character varying,
    id_pegawai_pengganti character varying(10),
    alasan_perubahan text,
    disetujui_oleh character varying(10),
    tanggal_persetujuan timestamp without time zone,
    status_persetujuan character varying(15) DEFAULT 'APPROVED'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT t_shift_harian_pegawai_jenis_perubahan_check CHECK (((jenis_perubahan)::text = ANY ((ARRAY['NORMAL'::character varying, 'TUKAR_SHIFT'::character varying, 'LEMBUR'::character varying, 'PENUGASAN_KHUSUS'::character varying, 'MOBILE_DUTY'::character varying])::text[]))),
    CONSTRAINT t_shift_harian_pegawai_status_persetujuan_check CHECK (((status_persetujuan)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE absensi.t_shift_harian_pegawai OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 26057)
-- Name: t_shift_pegawai; Type: TABLE; Schema: absensi; Owner: postgres
--

CREATE TABLE absensi.t_shift_pegawai (
    id character varying(20) NOT NULL,
    id_pegawai character varying(10) NOT NULL,
    id_shift_kerja character varying(8),
    id_shift_group character varying(8),
    tanggal_mulai date NOT NULL,
    tanggal_akhir date,
    is_aktif boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_shift_assignment CHECK ((((id_shift_kerja IS NOT NULL) AND (id_shift_group IS NULL)) OR ((id_shift_kerja IS NULL) AND (id_shift_group IS NOT NULL)))),
    CONSTRAINT check_tanggal_shift CHECK (((tanggal_akhir IS NULL) OR (tanggal_akhir >= tanggal_mulai)))
);


ALTER TABLE absensi.t_shift_pegawai OWNER TO postgres;

--
-- TOC entry 4623 (class 0 OID 26244)
-- Dependencies: 228
-- Data for Name: l_realisasi_lembur; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.l_realisasi_lembur (id, id_pegawai, periode_bulan_lembur, total_jam_lembur_bulanan, total_hari_terlambat_bulanan, rata_menit_keterlambatan, total_hari_tidak_hadir, total_hari_kerja_efektif, persentase_kehadiran, is_data_final, tanggal_finalisasi_data, difinalisasi_oleh, created_at, updated_at) FROM stdin;
LEM-PG001-202501	PG001	2025-01-01	0.00	1	45.00	0	23	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457
LEM-PG002-202501	PG002	2025-01-01	0.00	0	0.00	0	31	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457
LEM-PG003-202501	PG003	2025-01-01	1.00	1	90.00	0	22	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457
LEM-PG004-202501	PG004	2025-01-01	4.00	0	0.00	0	31	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457
LEM-PG005-202501	PG005	2025-01-01	0.00	0	0.00	0	31	100.00	f	\N	\N	2025-08-21 09:47:09.510457	2025-08-21 09:47:09.510457
\.


--
-- TOC entry 4615 (class 0 OID 25988)
-- Dependencies: 220
-- Data for Name: m_kebijakan_absensi; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_kebijakan_absensi (id, nama, kode_referensi, type_referensi, toleransi_keterlambatan, min_jam_kerja_full_day, aturan_potongan_terlambat, kebijakan_lembur_otomatis, jam_cut_off_hari, batas_radius_toleransi, is_default, is_aktif, created_at, updated_at) FROM stdin;
KBJ-0001	Kebijakan Umum Bank Sultra	\N	GLOBAL	15	8.00	\N	\N	23:59:59	0	t	t	2025-08-21 09:40:34.423857	2025-08-21 09:40:34.423857
KBJ-0002	Kebijakan Security	OPR	DIVISI	5	8.00	\N	\N	23:59:59	0	f	t	2025-08-21 09:40:34.423857	2025-08-21 09:40:34.423857
KBJ-0003	Kebijakan Mobile Worker	MOBILE	CUSTOM	30	7.50	\N	\N	23:59:59	0	f	t	2025-08-21 09:40:34.423857	2025-08-21 09:40:34.423857
\.


--
-- TOC entry 4611 (class 0 OID 25921)
-- Dependencies: 216
-- Data for Name: m_lokasi_kerja; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_lokasi_kerja (id, kode_referensi, type_lokasi, nama, alamat, latitude, longitude, radius, is_aktif, keterangan, created_at, updated_at) FROM stdin;
LOK-0001	000	CABANG	Kantor Pusat Bank Sultra	Jl. Mayjen Sutoyo No.1, Kendari	-3.99449170	122.51325710	50	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0002	101	CABANG	Cabang Kendari	Jl. Ahmad Yani No.50, Kendari	-3.98500000	122.52000000	30	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0003	102	CABANG	Cabang Bau-Bau	Jl. Betoambari No.25, Bau-Bau	-5.48705360	122.62214390	30	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0004	SAMSAT_01	CUSTOM	Samsat Keliling Pasar Sentral	Pasar Sentral Kendari	-3.99000000	122.51000000	25	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
LOK-0005	ATM_01	CUSTOM	Security ATM Mall Kendari	Mall Kendari, Lt.1	-3.99200000	122.51500000	20	t	\N	2025-08-20 15:01:45.097516	2025-08-20 15:01:45.097516
\.


--
-- TOC entry 4610 (class 0 OID 25908)
-- Dependencies: 215
-- Data for Name: m_pegawai_absensi; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_pegawai_absensi (id_pegawai, nama_pegawai, email, id_cabang, nama_cabang, id_divisi, nama_divisi, id_bagian, nama_bagian, id_unit_kerja, nama_unit_kerja, status, is_aktif, path_foto_master, last_sync_api, created_at, updated_at) FROM stdin;
PG001	Ahmad Wijaya	ahmad.wijaya@banksultra.co.id	000	KANTOR PUSAT	SDM	DIVISI SUMBER DAYA MANUSIA	0025	BAGIAN PENGEMBANGAN SDM	000025	STAFF SDM	A	t	\N	\N	2025-08-21 09:18:45.42974	2025-08-21 09:18:45.42974
PG002	Budi Santoso	budi.santoso@banksultra.co.id	000	KANTOR PUSAT	OPR	DIVISI OPERASIONAL	0040	BAGIAN KEAMANAN	000040	SECURITY	A	t	\N	\N	2025-08-21 09:18:45.42974	2025-08-21 09:18:45.42974
PG003	Citra Dewi	citra.dewi@banksultra.co.id	101	CABANG KENDARI	OPR	DIVISI OPERASIONAL	0035	BAGIAN LAYANAN MOBILE	000035	MOBILE BANKING OFFICER	A	t	\N	\N	2025-08-21 09:18:45.42974	2025-08-21 09:18:45.42974
PG004	Eko Prasetyo	eko.prasetyo@banksultra.co.id	000	KANTOR PUSAT	OPR	DIVISI OPERASIONAL	0040	BAGIAN KEAMANAN	000040	SECURITY	A	t	\N	\N	2025-08-21 09:18:45.42974	2025-08-21 09:18:45.42974
PG005	Dedi Kurniawan	dedi.kurniawan@banksultra.co.id	000	KANTOR PUSAT	OPR	DIVISI OPERASIONAL	0040	BAGIAN KEAMANAN	000040	SECURITY	A	t	\N	\N	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
\.


--
-- TOC entry 4613 (class 0 OID 25954)
-- Dependencies: 218
-- Data for Name: m_shift_group; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.m_shift_group (id, nama, durasi_rotasi_minggu, keterangan, is_aktif, created_at, updated_at) FROM stdin;
GRP-0001	Security Rotasi 3 Minggu	3	Rotasi security setiap 3 minggu: Pagi -> Siang -> Malam	t	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
GRP-0002	Security Pattern 2-2-2	1	Pattern security 2 hari: P,P,S,S,M,M kemudian repeat	t	2025-08-21 09:09:25.064716	2025-08-21 09:09:25.064716
\.


--
-- TOC entry 4614 (class 0 OID 25966)
-- Dependencies: 219
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
-- TOC entry 4612 (class 0 OID 25936)
-- Dependencies: 217
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
-- TOC entry 4616 (class 0 OID 26008)
-- Dependencies: 221
-- Data for Name: r_hari_libur; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.r_hari_libur (tanggal, nama_libur, jenis_libur, keterangan, created_at, updated_at) FROM stdin;
2025-01-25	Sabtu Libur Bank	LIBUR_DAERAH	Libur khusus bank untuk staff kantoran	2025-08-21 09:18:17.094267	2025-08-21 09:18:17.094267
2025-01-26	Minggu	LIBUR_DAERAH	Libur mingguan	2025-08-21 09:18:17.094267	2025-08-21 09:18:17.094267
2025-02-12	Tahun Baru Imlek	LIBUR_NASIONAL	Hari libur nasional	2025-08-21 09:18:17.094267	2025-08-21 09:18:17.094267
\.


--
-- TOC entry 4624 (class 0 OID 26275)
-- Dependencies: 229
-- Data for Name: s_audit_log; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.s_audit_log (id, nama_tabel, id_record, jenis_aksi, data_lama, data_baru, id_user_pelaku, alamat_ip, user_agent_info, alasan_perubahan, created_at) FROM stdin;
AUD-20250124143000-001	t_absensi_harian	ABS-PG001-20250123	UPDATE	{"jam_masuk_aktual": "08:45:00", "status_kehadiran": "Terlambat", "menit_keterlambatan": 45}	{"jam_masuk_aktual": "08:00:00", "status_kehadiran": "Hadir", "menit_keterlambatan": 0}	PG001	192.168.1.100	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36	Koreksi absensi disetujui atasan	2025-08-21 09:48:08.77502
AUD-20250124160000-001	t_shift_harian_pegawai	JDW-PG002-20250125	UPDATE	{"jenis_perubahan": "NORMAL", "id_shift_kerja_aktual": null, "id_shift_kerja_jadwal": "SHF-0005"}	{"jenis_perubahan": "TUKAR_SHIFT", "id_shift_kerja_aktual": "SHF-0003", "id_shift_kerja_jadwal": "SHF-0005"}	PG001	192.168.1.101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36	Persetujuan tukar shift security	2025-08-21 09:48:08.77502
AUD-20250125063000-001	t_shift_harian_pegawai	JDW-PG003-20250125	INSERT	\N	{"id_pegawai": "PG003", "tanggal_kerja": "2025-01-25", "jenis_perubahan": "PENUGASAN_KHUSUS"}	PG001	192.168.1.102	Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)	Emergency assignment approval	2025-08-21 09:48:08.77502
AUD-20250123220000-001	t_absensi_harian	ABS-PG004-20250123	UPDATE	{"jam_pulang_aktual": "22:00:00", "jam_lembur_dihitung": 0, "is_shift_lintas_hari": false}	{"jam_pulang_aktual": "02:00:00", "jam_lembur_dihitung": 4.00, "is_shift_lintas_hari": true}	PG001	192.168.1.103	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36	Approve extreme overtime - emergency maintenance	2025-08-21 09:48:08.77502
\.


--
-- TOC entry 4625 (class 0 OID 26284)
-- Dependencies: 230
-- Data for Name: s_proses_harian; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.s_proses_harian (id, tanggal_proses, jenis_proses, status_proses, waktu_mulai, waktu_selesai, total_data_diproses, jumlah_success, jumlah_error, detail_error, catatan, created_at) FROM stdin;
PRC-20250122-001	2025-01-22	REKONSILIASI	SUCCESS	2025-01-23 02:00:00	2025-01-23 02:15:00	16	16	0	\N	Rekonsiliasi log absensi berhasil untuk 4 pegawai	2025-08-21 09:48:08.77502
PRC-20250122-002	2025-01-22	VALIDASI	SUCCESS	2025-01-23 02:15:00	2025-01-23 02:18:00	16	16	0	\N	Validasi geofencing semua log berhasil	2025-08-21 09:48:08.77502
PRC-20250122-003	2025-01-22	BACKUP	SUCCESS	2025-01-23 03:00:00	2025-01-23 03:45:00	1	1	0	\N	Backup database harian berhasil	2025-08-21 09:48:08.77502
PRC-20250123-001	2025-01-23	SYNC_API	PARTIAL	2025-01-24 01:00:00	2025-01-24 01:30:00	5	4	1	\N	Sync ke payroll berhasil 4 dari 5 pegawai. Error pada PG004 karena lembur extreme.	2025-08-21 09:48:08.77502
\.


--
-- TOC entry 4621 (class 0 OID 26150)
-- Dependencies: 226
-- Data for Name: t_absensi_harian; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_absensi_harian (id, id_pegawai, tanggal_absensi, id_shift_kerja, id_lokasi_kerja_digunakan, jam_masuk_jadwal, jam_pulang_jadwal, jam_masuk_aktual, jam_keluar_istirahat_aktual, jam_masuk_istirahat_aktual, jam_pulang_aktual, id_log_masuk, id_log_keluar_istirahat, id_log_masuk_istirahat, id_log_pulang, status_kehadiran, menit_keterlambatan, menit_pulang_cepat, total_jam_kerja_efektif, jam_lembur_dihitung, tanggal_kerja_efektif, is_shift_lintas_hari, id_kebijakan_absensi, catatan_khusus, is_data_final, difinalisasi_oleh, tanggal_finalisasi, created_at, updated_at) FROM stdin;
ABS-PG001-20250122	PG001	2025-01-22	SHF-0001	LOK-0001	08:00:00	17:00:00	07:58:00	12:00:00	13:00:00	17:03:00	LOG-PG001-20250122075800	LOG-PG001-20250122120000	LOG-PG001-20250122130000	LOG-PG001-20250122170300	Hadir	0	0	8.05	0.00	2025-01-22	f	KBJ-0001	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283
ABS-PG002-20250121	PG002	2025-01-21	SHF-0005	LOK-0001	22:00:00	06:00:00	21:58:00	02:00:00	02:30:00	06:05:00	LOG-PG002-20250121215800	LOG-PG002-20250122020000	LOG-PG002-20250122023000	LOG-PG002-20250122060500	Hadir	0	0	7.62	0.00	2025-01-21	t	KBJ-0002	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283
ABS-PG003-20250122	PG003	2025-01-22	SHF-0006	LOK-0004	07:00:00	15:00:00	06:55:00	11:30:00	12:30:00	15:08:00	LOG-PG003-20250122065500	LOG-PG003-20250122113000	LOG-PG003-20250122123000	LOG-PG003-20250122150800	Hadir	0	0	7.72	0.00	2025-01-22	f	KBJ-0003	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283
ABS-PG004-20250122	PG004	2025-01-22	SHF-0004	LOK-0001	14:00:00	22:00:00	13:55:00	18:00:00	18:30:00	22:03:00	LOG-PG004-20250122135500	LOG-PG004-20250122180000	LOG-PG004-20250122183000	LOG-PG004-20250122220300	Hadir	0	0	7.63	0.00	2025-01-22	f	KBJ-0002	\N	f	\N	\N	2025-08-21 09:40:41.033283	2025-08-21 09:40:41.033283
ABS-PG001-20250123	PG001	2025-01-23	SHF-0001	LOK-0001	08:00:00	17:00:00	08:45:00	\N	\N	17:20:00	LOG-PG001-20250123084500	\N	\N	LOG-PG001-20250123172000	Terlambat	45	0	7.58	0.00	2025-01-23	f	KBJ-0001	\N	f	\N	\N	2025-08-21 09:41:38.080612	2025-08-21 09:41:38.080612
ABS-PG003-20250125	PG003	2025-01-25	SHF-0006	LOK-0003	07:00:00	15:00:00	08:30:00	\N	\N	16:00:00	LOG-PG003-20250125083000	\N	\N	LOG-PG003-20250125160000	Hadir	90	0	6.50	1.00	2025-01-25	f	KBJ-0003	Emergency assignment di Cabang Bau-Bau untuk maintenance ATM. Keterlambatan karena perjalanan jauh dan kondisi emergency.	f	\N	\N	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
ABS-PG004-20250123	PG004	2025-01-23	SHF-0004	LOK-0001	14:00:00	22:00:00	13:58:00	18:00:00	18:30:00	02:00:00	LOG-PG004-20250123135800	LOG-PG004-20250123180000	LOG-PG004-20250123183000	LOG-PG004-20250124020000	Hadir	0	0	11.50	4.00	2025-01-23	t	KBJ-0002	Lembur emergency maintenance sistem keamanan sampai dini hari. Shift siang extended menjadi lintas hari.	f	\N	\N	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
\.


--
-- TOC entry 4622 (class 0 OID 26217)
-- Dependencies: 227
-- Data for Name: t_koreksi_absensi; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_koreksi_absensi (id, id_absensi_harian, id_pegawai_pemohon, tanggal_pengajuan, jenis_koreksi, alasan, data_lama, data_usulan, path_dokumen_pendukung, status, id_atasan_penyetuju, tanggal_approval, catatan_atasan, created_at, updated_at) FROM stdin;
KOR-PG001-20250124	ABS-PG001-20250123	PG001	2025-01-24 09:30:00	JAM_MASUK	Terlambat karena macet parah akibat kecelakaan di Jalan Ahmad Yani. Saya sudah berusaha berangkat lebih awal namun tetap terjebak macet selama 1 jam lebih.	{"jam_masuk_aktual": "08:45:00", "status_kehadiran": "Terlambat", "menit_keterlambatan": 45}	{"jam_masuk_aktual": "08:00:00", "status_kehadiran": "Hadir", "menit_keterlambatan": 0}	\N	APPROVED	PG001	2025-01-24 14:15:00	Disetujui karena memang terjadi kecelakaan yang menyebabkan macet total. Untuk kedepan harap berangkat lebih awal jika ada prediksi kemacetan.	2025-08-21 09:43:10.583637	2025-08-21 09:43:10.583637
\.


--
-- TOC entry 4620 (class 0 OID 26127)
-- Dependencies: 225
-- Data for Name: t_log_raw_absensi; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_log_raw_absensi (id, id_pegawai, waktu_log, source_absensi, id_device, koordinat_gps, id_lokasi_kerja, is_validasi_geofence, jarak_dari_lokasi, akurasi_gps, path_bukti_foto, qr_hash, keterangan_log, status_validasi, created_at, updated_at) FROM stdin;
LOG-PG001-20250122075800	PG001	2025-01-22 07:58:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	15.50	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG001-20250122120000	PG001	2025-01-22 12:00:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	12.00	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG001-20250122130000	PG001	2025-01-22 13:00:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	12.00	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG001-20250122170300	PG001	2025-01-22 17:03:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	15.50	3.00	\N	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG002-20250121215800	PG002	2025-01-21 21:58:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250121_215800.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG002-20250122020000	PG002	2025-01-22 02:00:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250122_020000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG002-20250122023000	PG002	2025-01-22 02:30:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250122_023000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG002-20250122060500	PG002	2025-01-22 06:05:00	2	PHONE_BUDI_ANDROID	-3.9945000,122.5133000	LOK-0001	t	25.30	8.50	/uploads/selfie_budi_20250122_060500.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG003-20250122065500	PG003	2025-01-22 06:55:00	2	PHONE_CITRA_IPHONE	-3.9900000,122.5100000	LOK-0004	t	18.70	5.20	/uploads/selfie_citra_20250122_065500.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG003-20250122113000	PG003	2025-01-22 11:30:00	2	PHONE_CITRA_IPHONE	-3.9901000,122.5101000	LOK-0004	t	20.10	6.10	/uploads/selfie_citra_20250122_113000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG003-20250122123000	PG003	2025-01-22 12:30:00	2	PHONE_CITRA_IPHONE	-3.9901000,122.5101000	LOK-0004	t	20.10	6.10	/uploads/selfie_citra_20250122_123000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG003-20250122150800	PG003	2025-01-22 15:08:00	2	PHONE_CITRA_IPHONE	-3.9900500,122.5100500	LOK-0004	t	19.20	5.80	/uploads/selfie_citra_20250122_150800.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG004-20250122135500	PG004	2025-01-22 13:55:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_135500.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG004-20250122180000	PG004	2025-01-22 18:00:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_180000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG004-20250122183000	PG004	2025-01-22 18:30:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_183000.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG004-20250122220300	PG004	2025-01-22 22:03:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250122_220300.jpg	\N	\N	VALID	2025-08-21 09:30:57.078995	2025-08-21 09:30:57.078995
LOG-PG001-20250123084500	PG001	2025-01-23 08:45:00	2	PHONE_AHMAD_SAMSUNG	-3.9944917,122.5132571	LOK-0001	t	18.20	6.50	\N	\N	\N	VALID	2025-08-21 09:41:38.080612	2025-08-21 09:41:38.080612
LOG-PG001-20250123172000	PG001	2025-01-23 17:20:00	1	MESIN_FINGERPRINT_001	-3.9944917,122.5132571	LOK-0001	t	12.00	3.00	\N	\N	\N	VALID	2025-08-21 09:41:38.080612	2025-08-21 09:41:38.080612
LOG-PG003-20250125083000	PG003	2025-01-25 08:30:00	2	PHONE_CITRA_IPHONE	-5.4870536,122.6221439	LOK-0003	t	22.50	8.20	/uploads/selfie_citra_20250125_083000.jpg	\N	Emergency assignment - ATM maintenance	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
LOG-PG003-20250125160000	PG003	2025-01-25 16:00:00	2	PHONE_CITRA_IPHONE	-5.4870536,122.6221439	LOK-0003	t	22.50	8.20	/uploads/selfie_citra_20250125_160000.jpg	\N	Emergency assignment completed	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
LOG-PG004-20250123135800	PG004	2025-01-23 13:58:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250123_135800.jpg	\N	Shift siang normal	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
LOG-PG004-20250123180000	PG004	2025-01-23 18:00:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250123_180000.jpg	\N	Istirahat siang	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
LOG-PG004-20250123183000	PG004	2025-01-23 18:30:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250123_183000.jpg	\N	Selesai istirahat	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
LOG-PG004-20250124020000	PG004	2025-01-24 02:00:00	2	PHONE_EKO_SAMSUNG	-3.9944500,122.5132000	LOK-0001	t	28.50	7.20	/uploads/selfie_eko_20250124_020000.jpg	\N	Lembur sampai dini hari - emergency maintenance	VALID	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
\.


--
-- TOC entry 4617 (class 0 OID 26018)
-- Dependencies: 222
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
-- TOC entry 4619 (class 0 OID 26082)
-- Dependencies: 224
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
-- TOC entry 4618 (class 0 OID 26057)
-- Dependencies: 223
-- Data for Name: t_shift_pegawai; Type: TABLE DATA; Schema: absensi; Owner: postgres
--

COPY absensi.t_shift_pegawai (id, id_pegawai, id_shift_kerja, id_shift_group, tanggal_mulai, tanggal_akhir, is_aktif, created_at, updated_at) FROM stdin;
ASG-PG001-202501	PG001	SHF-0001	\N	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG002-202501	PG002	\N	GRP-0001	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG003-202501	PG003	SHF-0006	\N	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG004-202501	PG004	\N	GRP-0002	2025-01-01	\N	t	2025-08-21 09:24:14.300322	2025-08-21 09:24:14.300322
ASG-PG005-202501	PG005	\N	GRP-0001	2025-01-01	\N	t	2025-08-21 09:45:14.318171	2025-08-21 09:45:14.318171
\.


--
-- TOC entry 4412 (class 2606 OID 26264)
-- Name: l_realisasi_lembur l_realisasi_lembur_id_pegawai_periode_bulan_lembur_key; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.l_realisasi_lembur
    ADD CONSTRAINT l_realisasi_lembur_id_pegawai_periode_bulan_lembur_key UNIQUE (id_pegawai, periode_bulan_lembur);


--
-- TOC entry 4414 (class 2606 OID 26590)
-- Name: l_realisasi_lembur l_realisasi_lembur_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.l_realisasi_lembur
    ADD CONSTRAINT l_realisasi_lembur_pkey PRIMARY KEY (id);


--
-- TOC entry 4381 (class 2606 OID 26007)
-- Name: m_kebijakan_absensi m_kebijakan_absensi_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_kebijakan_absensi
    ADD CONSTRAINT m_kebijakan_absensi_pkey PRIMARY KEY (id);


--
-- TOC entry 4366 (class 2606 OID 25933)
-- Name: m_lokasi_kerja m_lokasi_kerja_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_lokasi_kerja
    ADD CONSTRAINT m_lokasi_kerja_pkey PRIMARY KEY (id);


--
-- TOC entry 4360 (class 2606 OID 25920)
-- Name: m_pegawai_absensi m_pegawai_absensi_email_key; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_pegawai_absensi
    ADD CONSTRAINT m_pegawai_absensi_email_key UNIQUE (email);


--
-- TOC entry 4362 (class 2606 OID 25918)
-- Name: m_pegawai_absensi m_pegawai_absensi_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_pegawai_absensi
    ADD CONSTRAINT m_pegawai_absensi_pkey PRIMARY KEY (id_pegawai);


--
-- TOC entry 4377 (class 2606 OID 25977)
-- Name: m_shift_group_detail m_shift_group_detail_id_shift_group_hari_dalam_minggu_uruta_key; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_shift_group_detail
    ADD CONSTRAINT m_shift_group_detail_id_shift_group_hari_dalam_minggu_uruta_key UNIQUE (id_shift_group, hari_dalam_minggu, urutan_minggu);


--
-- TOC entry 4379 (class 2606 OID 25975)
-- Name: m_shift_group_detail m_shift_group_detail_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_shift_group_detail
    ADD CONSTRAINT m_shift_group_detail_pkey PRIMARY KEY (id);


--
-- TOC entry 4375 (class 2606 OID 25965)
-- Name: m_shift_group m_shift_group_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_shift_group
    ADD CONSTRAINT m_shift_group_pkey PRIMARY KEY (id);


--
-- TOC entry 4371 (class 2606 OID 25953)
-- Name: m_shift_kerja m_shift_kerja_kode_shift_key; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_shift_kerja
    ADD CONSTRAINT m_shift_kerja_kode_shift_key UNIQUE (kode_shift);


--
-- TOC entry 4373 (class 2606 OID 25951)
-- Name: m_shift_kerja m_shift_kerja_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_shift_kerja
    ADD CONSTRAINT m_shift_kerja_pkey PRIMARY KEY (id);


--
-- TOC entry 4383 (class 2606 OID 26017)
-- Name: r_hari_libur r_hari_libur_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.r_hari_libur
    ADD CONSTRAINT r_hari_libur_pkey PRIMARY KEY (tanggal);


--
-- TOC entry 4417 (class 2606 OID 26592)
-- Name: s_audit_log s_audit_log_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.s_audit_log
    ADD CONSTRAINT s_audit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4420 (class 2606 OID 26594)
-- Name: s_proses_harian s_proses_harian_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.s_proses_harian
    ADD CONSTRAINT s_proses_harian_pkey PRIMARY KEY (id);


--
-- TOC entry 4422 (class 2606 OID 26301)
-- Name: s_proses_harian s_proses_harian_tanggal_proses_jenis_proses_key; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.s_proses_harian
    ADD CONSTRAINT s_proses_harian_tanggal_proses_jenis_proses_key UNIQUE (tanggal_proses, jenis_proses);


--
-- TOC entry 4404 (class 2606 OID 26171)
-- Name: t_absensi_harian t_absensi_harian_id_pegawai_tanggal_absensi_key; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_pegawai_tanggal_absensi_key UNIQUE (id_pegawai, tanggal_absensi);


--
-- TOC entry 4406 (class 2606 OID 26562)
-- Name: t_absensi_harian t_absensi_harian_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_pkey PRIMARY KEY (id);


--
-- TOC entry 4409 (class 2606 OID 26228)
-- Name: t_koreksi_absensi t_koreksi_absensi_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_koreksi_absensi
    ADD CONSTRAINT t_koreksi_absensi_pkey PRIMARY KEY (id);


--
-- TOC entry 4400 (class 2606 OID 26540)
-- Name: t_log_raw_absensi t_log_raw_absensi_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_log_raw_absensi
    ADD CONSTRAINT t_log_raw_absensi_pkey PRIMARY KEY (id);


--
-- TOC entry 4388 (class 2606 OID 26538)
-- Name: t_pegawai_lokasi_kerja t_pegawai_lokasi_kerja_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_pegawai_lokasi_kerja
    ADD CONSTRAINT t_pegawai_lokasi_kerja_pkey PRIMARY KEY (id);


--
-- TOC entry 4394 (class 2606 OID 26096)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_id_pegawai_tanggal_kerja_key; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_id_pegawai_tanggal_kerja_key UNIQUE (id_pegawai, tanggal_kerja);


--
-- TOC entry 4396 (class 2606 OID 26094)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_pkey PRIMARY KEY (id);


--
-- TOC entry 4390 (class 2606 OID 26536)
-- Name: t_shift_pegawai t_shift_pegawai_pkey; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_pegawai
    ADD CONSTRAINT t_shift_pegawai_pkey PRIMARY KEY (id);


--
-- TOC entry 4368 (class 2606 OID 25935)
-- Name: m_lokasi_kerja unique_kode_referensi_type; Type: CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_lokasi_kerja
    ADD CONSTRAINT unique_kode_referensi_type UNIQUE (kode_referensi, type_lokasi);


--
-- TOC entry 4401 (class 1259 OID 26315)
-- Name: idx_absensi_pegawai_periode; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_absensi_pegawai_periode ON absensi.t_absensi_harian USING btree (id_pegawai, tanggal_absensi);


--
-- TOC entry 4402 (class 1259 OID 26314)
-- Name: idx_absensi_tanggal_kerja_efektif; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_absensi_tanggal_kerja_efektif ON absensi.t_absensi_harian USING btree (tanggal_kerja_efektif);


--
-- TOC entry 4415 (class 1259 OID 26318)
-- Name: idx_audit_tanggal_tabel; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_audit_tanggal_tabel ON absensi.s_audit_log USING btree (created_at, nama_tabel);


--
-- TOC entry 4407 (class 1259 OID 26316)
-- Name: idx_koreksi_status_tanggal; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_koreksi_status_tanggal ON absensi.t_koreksi_absensi USING btree (status, tanggal_pengajuan);


--
-- TOC entry 4410 (class 1259 OID 26317)
-- Name: idx_lembur_periode; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_lembur_periode ON absensi.l_realisasi_lembur USING btree (periode_bulan_lembur, is_data_final);


--
-- TOC entry 4397 (class 1259 OID 26313)
-- Name: idx_log_absensi_pegawai_tanggal; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_log_absensi_pegawai_tanggal ON absensi.t_log_raw_absensi USING btree (id_pegawai, date(waktu_log));


--
-- TOC entry 4398 (class 1259 OID 26312)
-- Name: idx_log_absensi_waktu; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_log_absensi_waktu ON absensi.t_log_raw_absensi USING btree (waktu_log);


--
-- TOC entry 4363 (class 1259 OID 26305)
-- Name: idx_lokasi_geolocation; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_lokasi_geolocation ON absensi.m_lokasi_kerja USING btree (latitude, longitude) WHERE ((latitude IS NOT NULL) AND (longitude IS NOT NULL));


--
-- TOC entry 4384 (class 1259 OID 26309)
-- Name: idx_lokasi_shift_penugasan; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_lokasi_shift_penugasan ON absensi.t_pegawai_lokasi_kerja USING btree (id_lokasi_kerja, id_shift_kerja, jenis_penugasan);


--
-- TOC entry 4364 (class 1259 OID 26304)
-- Name: idx_lokasi_type_aktif; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_lokasi_type_aktif ON absensi.m_lokasi_kerja USING btree (type_lokasi, is_aktif);


--
-- TOC entry 4357 (class 1259 OID 26303)
-- Name: idx_pegawai_cabang_divisi; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_pegawai_cabang_divisi ON absensi.m_pegawai_absensi USING btree (id_cabang, id_divisi);


--
-- TOC entry 4385 (class 1259 OID 26307)
-- Name: idx_pegawai_lokasi_aktif; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_pegawai_lokasi_aktif ON absensi.t_pegawai_lokasi_kerja USING btree (id_pegawai, is_aktif, tanggal_mulai_berlaku, tanggal_akhir_berlaku);


--
-- TOC entry 4386 (class 1259 OID 26308)
-- Name: idx_pegawai_lokasi_prioritas; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_pegawai_lokasi_prioritas ON absensi.t_pegawai_lokasi_kerja USING btree (id_pegawai, prioritas_lokasi, is_lokasi_utama);


--
-- TOC entry 4358 (class 1259 OID 26302)
-- Name: idx_pegawai_status; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_pegawai_status ON absensi.m_pegawai_absensi USING btree (status, is_aktif);


--
-- TOC entry 4418 (class 1259 OID 26319)
-- Name: idx_proses_tanggal_status; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_proses_tanggal_status ON absensi.s_proses_harian USING btree (tanggal_proses, status_proses);


--
-- TOC entry 4391 (class 1259 OID 26311)
-- Name: idx_shift_harian_pegawai_bulan; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_shift_harian_pegawai_bulan ON absensi.t_shift_harian_pegawai USING btree (id_pegawai, tanggal_kerja);


--
-- TOC entry 4392 (class 1259 OID 26310)
-- Name: idx_shift_harian_tanggal_kerja; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_shift_harian_tanggal_kerja ON absensi.t_shift_harian_pegawai USING btree (tanggal_kerja);


--
-- TOC entry 4369 (class 1259 OID 26306)
-- Name: idx_shift_jenis_aktif; Type: INDEX; Schema: absensi; Owner: postgres
--

CREATE INDEX idx_shift_jenis_aktif ON absensi.m_shift_kerja USING btree (jenis_shift, is_aktif);


--
-- TOC entry 4467 (class 2620 OID 26334)
-- Name: l_realisasi_lembur update_l_realisasi_lembur_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_l_realisasi_lembur_updated_at BEFORE UPDATE ON absensi.l_realisasi_lembur FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4459 (class 2620 OID 26326)
-- Name: m_kebijakan_absensi update_m_kebijakan_absensi_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_m_kebijakan_absensi_updated_at BEFORE UPDATE ON absensi.m_kebijakan_absensi FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4455 (class 2620 OID 26322)
-- Name: m_lokasi_kerja update_m_lokasi_kerja_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_m_lokasi_kerja_updated_at BEFORE UPDATE ON absensi.m_lokasi_kerja FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4454 (class 2620 OID 26321)
-- Name: m_pegawai_absensi update_m_pegawai_absensi_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_m_pegawai_absensi_updated_at BEFORE UPDATE ON absensi.m_pegawai_absensi FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4458 (class 2620 OID 26325)
-- Name: m_shift_group_detail update_m_shift_group_detail_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_m_shift_group_detail_updated_at BEFORE UPDATE ON absensi.m_shift_group_detail FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4457 (class 2620 OID 26324)
-- Name: m_shift_group update_m_shift_group_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_m_shift_group_updated_at BEFORE UPDATE ON absensi.m_shift_group FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4456 (class 2620 OID 26323)
-- Name: m_shift_kerja update_m_shift_kerja_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_m_shift_kerja_updated_at BEFORE UPDATE ON absensi.m_shift_kerja FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4460 (class 2620 OID 26327)
-- Name: r_hari_libur update_r_hari_libur_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_r_hari_libur_updated_at BEFORE UPDATE ON absensi.r_hari_libur FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4465 (class 2620 OID 26332)
-- Name: t_absensi_harian update_t_absensi_harian_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_t_absensi_harian_updated_at BEFORE UPDATE ON absensi.t_absensi_harian FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4466 (class 2620 OID 26333)
-- Name: t_koreksi_absensi update_t_koreksi_absensi_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_t_koreksi_absensi_updated_at BEFORE UPDATE ON absensi.t_koreksi_absensi FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4464 (class 2620 OID 26331)
-- Name: t_log_raw_absensi update_t_log_raw_absensi_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_t_log_raw_absensi_updated_at BEFORE UPDATE ON absensi.t_log_raw_absensi FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4461 (class 2620 OID 26328)
-- Name: t_pegawai_lokasi_kerja update_t_pegawai_lokasi_kerja_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_t_pegawai_lokasi_kerja_updated_at BEFORE UPDATE ON absensi.t_pegawai_lokasi_kerja FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4463 (class 2620 OID 26330)
-- Name: t_shift_harian_pegawai update_t_shift_harian_pegawai_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_t_shift_harian_pegawai_updated_at BEFORE UPDATE ON absensi.t_shift_harian_pegawai FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4462 (class 2620 OID 26329)
-- Name: t_shift_pegawai update_t_shift_pegawai_updated_at; Type: TRIGGER; Schema: absensi; Owner: postgres
--

CREATE TRIGGER update_t_shift_pegawai_updated_at BEFORE UPDATE ON absensi.t_shift_pegawai FOR EACH ROW EXECUTE FUNCTION absensi.update_updated_at_column();


--
-- TOC entry 4452 (class 2606 OID 26270)
-- Name: l_realisasi_lembur l_realisasi_lembur_difinalisasi_oleh_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.l_realisasi_lembur
    ADD CONSTRAINT l_realisasi_lembur_difinalisasi_oleh_fkey FOREIGN KEY (difinalisasi_oleh) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE SET NULL;


--
-- TOC entry 4453 (class 2606 OID 26265)
-- Name: l_realisasi_lembur l_realisasi_lembur_id_pegawai_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.l_realisasi_lembur
    ADD CONSTRAINT l_realisasi_lembur_id_pegawai_fkey FOREIGN KEY (id_pegawai) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE CASCADE;


--
-- TOC entry 4423 (class 2606 OID 25978)
-- Name: m_shift_group_detail m_shift_group_detail_id_shift_group_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_shift_group_detail
    ADD CONSTRAINT m_shift_group_detail_id_shift_group_fkey FOREIGN KEY (id_shift_group) REFERENCES absensi.m_shift_group(id) ON DELETE CASCADE;


--
-- TOC entry 4424 (class 2606 OID 25983)
-- Name: m_shift_group_detail m_shift_group_detail_id_shift_kerja_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.m_shift_group_detail
    ADD CONSTRAINT m_shift_group_detail_id_shift_kerja_fkey FOREIGN KEY (id_shift_kerja) REFERENCES absensi.m_shift_kerja(id) ON DELETE RESTRICT;


--
-- TOC entry 4440 (class 2606 OID 26212)
-- Name: t_absensi_harian t_absensi_harian_difinalisasi_oleh_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_difinalisasi_oleh_fkey FOREIGN KEY (difinalisasi_oleh) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE SET NULL;


--
-- TOC entry 4441 (class 2606 OID 26207)
-- Name: t_absensi_harian t_absensi_harian_id_kebijakan_absensi_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_kebijakan_absensi_fkey FOREIGN KEY (id_kebijakan_absensi) REFERENCES absensi.m_kebijakan_absensi(id) ON DELETE RESTRICT;


--
-- TOC entry 4442 (class 2606 OID 26573)
-- Name: t_absensi_harian t_absensi_harian_id_log_keluar_istirahat_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_log_keluar_istirahat_fkey FOREIGN KEY (id_log_keluar_istirahat) REFERENCES absensi.t_log_raw_absensi(id) ON DELETE SET NULL;


--
-- TOC entry 4443 (class 2606 OID 26568)
-- Name: t_absensi_harian t_absensi_harian_id_log_masuk_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_log_masuk_fkey FOREIGN KEY (id_log_masuk) REFERENCES absensi.t_log_raw_absensi(id) ON DELETE SET NULL;


--
-- TOC entry 4444 (class 2606 OID 26578)
-- Name: t_absensi_harian t_absensi_harian_id_log_masuk_istirahat_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_log_masuk_istirahat_fkey FOREIGN KEY (id_log_masuk_istirahat) REFERENCES absensi.t_log_raw_absensi(id) ON DELETE SET NULL;


--
-- TOC entry 4445 (class 2606 OID 26583)
-- Name: t_absensi_harian t_absensi_harian_id_log_pulang_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_log_pulang_fkey FOREIGN KEY (id_log_pulang) REFERENCES absensi.t_log_raw_absensi(id) ON DELETE SET NULL;


--
-- TOC entry 4446 (class 2606 OID 26182)
-- Name: t_absensi_harian t_absensi_harian_id_lokasi_kerja_digunakan_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_lokasi_kerja_digunakan_fkey FOREIGN KEY (id_lokasi_kerja_digunakan) REFERENCES absensi.m_lokasi_kerja(id) ON DELETE SET NULL;


--
-- TOC entry 4447 (class 2606 OID 26172)
-- Name: t_absensi_harian t_absensi_harian_id_pegawai_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_pegawai_fkey FOREIGN KEY (id_pegawai) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE CASCADE;


--
-- TOC entry 4448 (class 2606 OID 26177)
-- Name: t_absensi_harian t_absensi_harian_id_shift_kerja_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_absensi_harian
    ADD CONSTRAINT t_absensi_harian_id_shift_kerja_fkey FOREIGN KEY (id_shift_kerja) REFERENCES absensi.m_shift_kerja(id) ON DELETE RESTRICT;


--
-- TOC entry 4449 (class 2606 OID 26563)
-- Name: t_koreksi_absensi t_koreksi_absensi_id_absensi_harian_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_koreksi_absensi
    ADD CONSTRAINT t_koreksi_absensi_id_absensi_harian_fkey FOREIGN KEY (id_absensi_harian) REFERENCES absensi.t_absensi_harian(id) ON DELETE CASCADE;


--
-- TOC entry 4450 (class 2606 OID 26239)
-- Name: t_koreksi_absensi t_koreksi_absensi_id_atasan_penyetuju_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_koreksi_absensi
    ADD CONSTRAINT t_koreksi_absensi_id_atasan_penyetuju_fkey FOREIGN KEY (id_atasan_penyetuju) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE SET NULL;


--
-- TOC entry 4451 (class 2606 OID 26234)
-- Name: t_koreksi_absensi t_koreksi_absensi_id_pegawai_pemohon_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_koreksi_absensi
    ADD CONSTRAINT t_koreksi_absensi_id_pegawai_pemohon_fkey FOREIGN KEY (id_pegawai_pemohon) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE CASCADE;


--
-- TOC entry 4438 (class 2606 OID 26145)
-- Name: t_log_raw_absensi t_log_raw_absensi_id_lokasi_kerja_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_log_raw_absensi
    ADD CONSTRAINT t_log_raw_absensi_id_lokasi_kerja_fkey FOREIGN KEY (id_lokasi_kerja) REFERENCES absensi.m_lokasi_kerja(id) ON DELETE SET NULL;


--
-- TOC entry 4439 (class 2606 OID 26140)
-- Name: t_log_raw_absensi t_log_raw_absensi_id_pegawai_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_log_raw_absensi
    ADD CONSTRAINT t_log_raw_absensi_id_pegawai_fkey FOREIGN KEY (id_pegawai) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE CASCADE;


--
-- TOC entry 4425 (class 2606 OID 26052)
-- Name: t_pegawai_lokasi_kerja t_pegawai_lokasi_kerja_disetujui_oleh_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_pegawai_lokasi_kerja
    ADD CONSTRAINT t_pegawai_lokasi_kerja_disetujui_oleh_fkey FOREIGN KEY (disetujui_oleh) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE SET NULL;


--
-- TOC entry 4426 (class 2606 OID 26042)
-- Name: t_pegawai_lokasi_kerja t_pegawai_lokasi_kerja_id_lokasi_kerja_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_pegawai_lokasi_kerja
    ADD CONSTRAINT t_pegawai_lokasi_kerja_id_lokasi_kerja_fkey FOREIGN KEY (id_lokasi_kerja) REFERENCES absensi.m_lokasi_kerja(id) ON DELETE RESTRICT;


--
-- TOC entry 4427 (class 2606 OID 26037)
-- Name: t_pegawai_lokasi_kerja t_pegawai_lokasi_kerja_id_pegawai_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_pegawai_lokasi_kerja
    ADD CONSTRAINT t_pegawai_lokasi_kerja_id_pegawai_fkey FOREIGN KEY (id_pegawai) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE CASCADE;


--
-- TOC entry 4428 (class 2606 OID 26047)
-- Name: t_pegawai_lokasi_kerja t_pegawai_lokasi_kerja_id_shift_kerja_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_pegawai_lokasi_kerja
    ADD CONSTRAINT t_pegawai_lokasi_kerja_id_shift_kerja_fkey FOREIGN KEY (id_shift_kerja) REFERENCES absensi.m_shift_kerja(id) ON DELETE SET NULL;


--
-- TOC entry 4432 (class 2606 OID 26122)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_disetujui_oleh_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_disetujui_oleh_fkey FOREIGN KEY (disetujui_oleh) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE SET NULL;


--
-- TOC entry 4433 (class 2606 OID 26112)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_id_lokasi_kerja_aktual_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_id_lokasi_kerja_aktual_fkey FOREIGN KEY (id_lokasi_kerja_aktual) REFERENCES absensi.m_lokasi_kerja(id) ON DELETE SET NULL;


--
-- TOC entry 4434 (class 2606 OID 26097)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_id_pegawai_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_id_pegawai_fkey FOREIGN KEY (id_pegawai) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE CASCADE;


--
-- TOC entry 4435 (class 2606 OID 26117)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_id_pegawai_pengganti_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_id_pegawai_pengganti_fkey FOREIGN KEY (id_pegawai_pengganti) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE SET NULL;


--
-- TOC entry 4436 (class 2606 OID 26107)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_id_shift_kerja_aktual_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_id_shift_kerja_aktual_fkey FOREIGN KEY (id_shift_kerja_aktual) REFERENCES absensi.m_shift_kerja(id) ON DELETE SET NULL;


--
-- TOC entry 4437 (class 2606 OID 26102)
-- Name: t_shift_harian_pegawai t_shift_harian_pegawai_id_shift_kerja_jadwal_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_harian_pegawai
    ADD CONSTRAINT t_shift_harian_pegawai_id_shift_kerja_jadwal_fkey FOREIGN KEY (id_shift_kerja_jadwal) REFERENCES absensi.m_shift_kerja(id) ON DELETE RESTRICT;


--
-- TOC entry 4429 (class 2606 OID 26067)
-- Name: t_shift_pegawai t_shift_pegawai_id_pegawai_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_pegawai
    ADD CONSTRAINT t_shift_pegawai_id_pegawai_fkey FOREIGN KEY (id_pegawai) REFERENCES absensi.m_pegawai_absensi(id_pegawai) ON DELETE CASCADE;


--
-- TOC entry 4430 (class 2606 OID 26077)
-- Name: t_shift_pegawai t_shift_pegawai_id_shift_group_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_pegawai
    ADD CONSTRAINT t_shift_pegawai_id_shift_group_fkey FOREIGN KEY (id_shift_group) REFERENCES absensi.m_shift_group(id) ON DELETE SET NULL;


--
-- TOC entry 4431 (class 2606 OID 26072)
-- Name: t_shift_pegawai t_shift_pegawai_id_shift_kerja_fkey; Type: FK CONSTRAINT; Schema: absensi; Owner: postgres
--

ALTER TABLE ONLY absensi.t_shift_pegawai
    ADD CONSTRAINT t_shift_pegawai_id_shift_kerja_fkey FOREIGN KEY (id_shift_kerja) REFERENCES absensi.m_shift_kerja(id) ON DELETE SET NULL;


-- Completed on 2025-08-21 16:50:42

--
-- PostgreSQL database dump complete
--

