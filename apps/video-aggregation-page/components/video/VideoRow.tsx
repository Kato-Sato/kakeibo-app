import Link from "next/link";
import { type Video } from "@/domain/video";
import styles from "./VideoRow.module.css";

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;

const pad2 = (value: number): string => String(value).padStart(2, "0");

function formatDuration(seconds: number | null): string {
    if (seconds === null || !Number.isFinite(seconds) || seconds < 0) {
        return "--:--";
    }

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
    const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
    const secs = totalSeconds % SECONDS_PER_MINUTE;

    return hours > 0
        ? `${hours}:${pad2(minutes)}:${pad2(secs)}`
        : `${minutes}:${pad2(secs)}`;
}
type ExternalLinkProps = {
    href: string;
    className?: string;
    children: React.ReactNode;
};

function ExternalLink({ href, className, children }: ExternalLinkProps) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >
            {children}
        </Link>
    );
}

type FeatureBadgeProps = {
  label: string;
  enabled: boolean;
};

function FeatureBadge({ label, enabled }: FeatureBadgeProps) {
    return (
        <li
            className={`${styles.badge} ${enabled ? styles.badgeOn : styles.badgeOff}`}
            aria-label={`${label}: ${enabled ? "あり" : "なし"}`}
        >
        <span aria-hidden="true">{enabled ? "✓" : "–"}</span>
            {label}
        </li>
    );
}

export default function VideoRow({ video }: { video: Video }) {
    const { title, youtubeUrl, patreonUrl, thumbnailUrl, duration, subtitle, voice } = video;
    const mainUrl = youtubeUrl ?? patreonUrl;

    const thumbnail = (
        <img
            src={thumbnailUrl ?? "/no-thumbnail.png"}
            alt={title}
            loading="lazy"
        />
    );

    return (
        <div className={styles.row}>
            <div className={styles.thumbnail}>
                {mainUrl ? <ExternalLink href={mainUrl}>{thumbnail}</ExternalLink> : thumbnail}

                <span className={styles.duration}>{formatDuration(duration)}</span>
            </div>

            <div className={styles.info}>
                {mainUrl ? (
                    <ExternalLink href={mainUrl} className={styles.title}>
                        {title}
                    </ExternalLink>
                    ) : (
                    <span className={styles.title}>{title}</span>
                )}

                <ul className={styles.badges}>
                    <FeatureBadge label="Subtitle" enabled={subtitle} />
                    <FeatureBadge label="Voice" enabled={voice} />
                </ul>

                <div className={styles.links}>
                    {youtubeUrl && (
                        <ExternalLink
                            href={youtubeUrl}
                            className={`${styles.platformLink} ${styles.youtube}`}
                        >
                            YouTube
                        </ExternalLink>
                    )}

                    {patreonUrl && (
                        <ExternalLink
                            href={patreonUrl}
                            className={`${styles.platformLink} ${styles.patreon}`}
                        >
                            Patreon
                        </ExternalLink>
                    )}
                </div>
            </div>
        </div>
    );
}