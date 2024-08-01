import dayjs from "dayjs";
import mustache from "mustache";
import { JSDOM } from "jsdom";

export const mustacheUtils = {
  string: {
    firstWord: () => {
      return (text: string, render: any) => {
        return render(text).split(" ")[0];
      };
    },
  },
  date: {
    format: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("DD MMMM YYYY");
      };
    },
    formatFull12: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("dddd, D MMMM YYYY h:mm A");
      };
    },
    formatFull24: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("dddd, D MMMM YYYY HH:mm");
      };
    },
    getDay: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("DD");
      };
    },
    getMonth: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("MM");
      };
    },
    getYear: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("YYYY");
      };
    },
    getTime12: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("h:mm A");
      };
    },
    getTime24: () => {
      return (date: string, render: any) => {
        return dayjs(render(date)).format("HH:mm");
      };
    },
  },
};

/**
 * Builds a template view object with additional properties and values.
 *
 * @param {object} options - Optional object containing additional properties and values.
 * @return {object} The template view object with additional properties and values.
 */
export const buildTemplateView = (options?: any) => ({
  ...options,
  rsvp_form: `<div id="rsvp-attendance-form"></div>`,
  util: mustacheUtils,
  extras: [
    `<script src="${process.env.NEXT_PUBLIC_SITE_URL}/dist/vitestory@rsvpAttendance-v0.1.0.js"></script>
      <script>
        RSVP('rsvp-attendance-form', {slug: "{{slug}}"});
      </script>`,
  ],
});

/**
 * Renders a template by replacing placeholders in the given HTML string with values from the view object.
 *
 * @param {any} view - The view object containing the data to be rendered.
 * @param {string} html - The HTML string with placeholders to be replaced.
 * @return {string} The rendered HTML string with placeholders replaced by values from the view object.
 */
export const renderTemplate = (view: any, html: string): string => {
  const dom: JSDOM = new JSDOM(html);

  const defaultLang = "id";

  // change html tag lang to default lang
  dom.window.document.documentElement.lang = defaultLang;

  // inject extras to body
  const body = dom.window.document.querySelector("body");
  if (body && view.extras.length > 0) {
    view.extras.forEach((extra: string) => {
      body.innerHTML += extra;
    });
  }

  return mustache.render(dom.serialize(), view);
};
